"use client";

import { workspace } from "@/lib/supabase/supabase.types";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface SelectedWorkspaceProps {
  workspace: workspace;
  onClick?: (option: workspace) => void;
}

const SelectedWorkspace: React.FC<SelectedWorkspaceProps> = ({
  workspace,
  onClick,
}) => {
  const [workspaceLogo, setWorkspaceLogo] = useState("/mindmarklogo.svg");

  useEffect(() => {
    if (workspace.logo) {
      const supabase = createClient();
      const path = supabase.storage
        .from("workspace-logos")
        .getPublicUrl(workspace.logo)?.data.publicUrl;
      setWorkspaceLogo(path);
    }
  }, [workspace.logo]);

  return (
    <Link
      href={`/dashboard/${workspace.id}`}
      onClick={() => {
        if (onClick) onClick(workspace);
      }}
      className="flex
      rounded-md
      hover:bg-muted
      transition-all
      flex-row
      p-2
      gap-4
      justify-center
      cursor-pointer
      items-center
     "
    >
      <Image
        src={workspaceLogo}
        alt="workspace logo"
        width={26}
        height={26}
        className="object-cover"
      />
      <div className="flex flex-col">
        <p
          className="text-lg
        w-[170px]
        overflow-hidden
        overflow-ellipsis
        whitespace-nowrap"
        >
          {workspace.title}
        </p>
      </div>
    </Link>
  );
};

export default SelectedWorkspace;
