import { redirect } from 'next/navigation';

/**
 * Root page - redirects to localhost domain
 * This allows accessing http://localhost:3005/ directly
 */
export default function RootPage() {
  // Redirect to the localhost domain by default in development
  redirect('/localhost');
}
