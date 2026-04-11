import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Luloy Flix</h1>
        <p className="text-muted-foreground text-lg">Login to your account</p>
      </div>
      <LoginForm />
    </div>
  );
}
