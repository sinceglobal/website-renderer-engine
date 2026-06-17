# syntax=docker/dockerfile:1
# Production image for the Next.js renderer (Dokploy, Build Type = Dockerfile).
#
# The shared UI library is a PRIVATE GitHub Packages dependency, so the install
# stage needs a token with read:packages. In Dokploy set it as a Build Arg:
#     NPM_TOKEN = <github token>
# It only lives in the (discarded) deps stage — it never reaches the final image.

# ── 1) deps: install node_modules incl. the private @sinceglobal lib ──────────
FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
ARG NPM_TOKEN
ENV NPM_TOKEN=${NPM_TOKEN}
# .npmrc points @sinceglobal → GitHub Packages and reads ${NPM_TOKEN} from env.
# Using package-lock.json* so it doesn't fail if we delete it to avoid local symlinks
COPY package.json package-lock.json* .npmrc ./
# Dev uses bun (bun.lock), so package-lock.json lags — use install, not ci.
# Ignore package-lock to avoid local 'link: true' issues breaking the Docker build
RUN npm install --no-audit --no-fund --no-package-lock

# ── 2) builder: compile the standalone server ────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# NEXT_PUBLIC_* are inlined at build time (optional; the code has a fallback).
ARG NEXT_PUBLIC_CRM_URL
ENV NEXT_PUBLIC_CRM_URL=${NEXT_PUBLIC_CRM_URL}
RUN npm run build

# ── 3) runner: minimal runtime image ─────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs
# Standalone output bundles server.js + a minimal node_modules; static assets
# and public/ are copied alongside it.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
