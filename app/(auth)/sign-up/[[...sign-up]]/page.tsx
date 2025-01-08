'use client';
import { SignUp } from '@clerk/nextjs';
import React, { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Loader from '@/components/shared/Loader';

const SignUpPageContent = () => {
  const router = useRouter();

  return (
    <main className="flex-center flex min-h-screen w-full flex-col gap-6 bg-auth-light bg-cover bg-center bg-no-repeat dark:bg-auth-dark">
      <Button onClick={() => router.push("../")}>Back</Button>
      <SignUp forceRedirectUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL} />
    </main>
  );
};

const SignUpPage = () => (
  <Suspense fallback={<Loader />}>
    <SignUpPageContent />
  </Suspense>
);

export default SignUpPage;
