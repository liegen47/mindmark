import MobileSidebar from '@/components/sidebar/mobile-sidebar';
import Sidebar from '@/components/sidebar/sidebar';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}

const Layout: React.FC<LayoutProps> = async ({ children, params }) => {
  const { workspaceId } = await params;

  return (
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar workspaceId={workspaceId} />
      <MobileSidebar>
        <Sidebar workspaceId={workspaceId} className="w-screen inline-block sm:hidden" />
      </MobileSidebar>
      <div
        className="dark:border-neutrals-12/70
        border-l-[1px]
        flex-1
        relative
        overflow-auto
      "
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
