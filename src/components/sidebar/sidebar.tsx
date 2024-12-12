import React from "react";
import {
  getCollaboratingWorkspaces,
  getFolders,
  getPrivateWorkspaces,
  getSharedWorkspaces,
  getUserSubscriptionStatus,
} from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { twMerge } from "tailwind-merge";
import FoldersDropdownList from "./folders-dropdown-list";
import UserCard from "./user-card";
import WorkspaceDropdown from "./workspace-dropdown";
import NativeNavigation from "./native-navigation";
import PlanUsage from "./plan-usage";
import { ScrollArea } from "../ui/scroll-area";

interface SidebarProps {
  workspaceId: string;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = async ({ workspaceId, className }) => {
  const supabase = await createClient();
  //user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  //subscription
  const { data: subscriptionData, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id);

  //folders
  const { data: workspaceFolderData, error: foldersError } = await getFolders(
    workspaceId
  );
  //error
  if (subscriptionError || foldersError) redirect("/dashboard");

  const [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces] =
    await Promise.all([
      getPrivateWorkspaces(user.id),
      getCollaboratingWorkspaces(user.id),
      getSharedWorkspaces(user.id),
    ]);

  //get all the different workspaces private collaborating shared
  return (
    <aside
      className={twMerge(
        "hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4 !justify-between",
        className
      )}
    >
      <div>
        <WorkspaceDropdown
          privateWorkspaces={privateWorkspaces}
          sharedWorkspaces={sharedWorkspaces}
          collaboratingWorkspaces={collaboratingWorkspaces}
          defaultValue={[
            ...privateWorkspaces,
            ...collaboratingWorkspaces,
            ...sharedWorkspaces,
          ].find((workspace) => workspace.id === workspaceId)}
        />
        <PlanUsage
          foldersLength={workspaceFolderData?.length || 0}
          subscription={subscriptionData}
        />
        <NativeNavigation myWorkspaceId={workspaceId} />
        <ScrollArea
          className=" relative
        h-[450px]
      "
        >
          <div
            className="pointer-events-none 
        w-full 
        absolute 
        bottom-0 
        h-20 
        bg-gradient-to-t 
        from-background 
        to-transparent 
        z-40"
          />
          <FoldersDropdownList
            workspaceFolders={workspaceFolderData || []}
            workspaceId={workspaceId}
          />
        </ScrollArea>
      </div>
      <UserCard subscription={subscriptionData} />
    </aside>
  );
};

export default Sidebar;
