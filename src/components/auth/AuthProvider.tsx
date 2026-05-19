'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import AuthModal from './AuthModal';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initialize, initialized } = useAuthStore();

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialize, initialized]);

  return (
    <>
      {children}
      <AuthModal />
    </>
  );
}