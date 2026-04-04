import { ReactNode } from 'react';

interface DomainLayoutProps {
  children: ReactNode;
  params: Promise<{
    domain: string;
  }>;
}

export default async function DomainLayout({
  children,
  params,
}: DomainLayoutProps) {
  // The dynamic domain layout wraps all routes under /[domain]
  return children;
}
