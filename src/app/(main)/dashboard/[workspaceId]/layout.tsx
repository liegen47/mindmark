// import MobileSidebar from "@/components/sidebar/mobile-sidebar";
import Sidebar from "@/components/sidebar/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: { workspaceId: string };
}

const Layout: React.FC<LayoutProps> = async ({ children, params }) => {
  const { workspaceId } = params;
  return (
    <main
      className="flex overflow-hidden
      h-screen
      w-screen
  "
    >
      <Sidebar workspaceId={workspaceId} />
      {/* <MobileSidebar>
        <Sidebar params={params} className="w-screen inline-block sm:hidden" />
      </MobileSidebar> */}
      <ScrollArea
        className="dark:border-Neutrals-12/70
        border-l-[1px]
        w-full
        relative
        
      "
      >
        {children}
      </ScrollArea>
    </main>
  );
};

export default Layout;
