'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TestKit() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/testKit/connect'); // Redirect to first step
  }, [router]);

  return (
    <></>
  ) // Empty page since user is redirected
}