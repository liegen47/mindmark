import React from 'react';
import AppStateProvider from '@/lib/providers/state-provider';
import { SupabaseUserProvider } from '@/lib/providers/supabase-user-provider';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = async ({ children }) => {
  return (
    <AppStateProvider>
      <SupabaseUserProvider>
        <div className="flex h-screen overflow-hidden bg-background">
          {children}
        </div>
      </SupabaseUserProvider>
    </AppStateProvider>
  );
};

export default Layout;
