'use client';
import SearchDialog from '@/components/search';
import { NavAutoHide } from '@/components/nav-auto-hide';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { type ReactNode } from 'react';

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider search={{ SearchDialog }}>
      <NavAutoHide />
      {children}
    </RootProvider>
  );
}
