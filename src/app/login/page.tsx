import LoginForm from '@/components/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Log in</h1>
      <LoginForm />
      <p className="mt-4 text-sm">
        Don't have an account?{' '}
        <Link href="/register" className="text-sky-600 underline">
          Create one
        </Link>
      </p>
    </main>
  );
}
