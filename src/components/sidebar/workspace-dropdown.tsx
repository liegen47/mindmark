'use client';

import { useAppState } from '@/lib/providers/state-provider';
import { workspace } from '@/lib/supabase/supabase.types';
import React, { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import SelectedWorkspace from './selected-workspace';
import CustomDialogTrigger from '../global/custom-dialog-trigger';
import WorkspaceCreator from '../global/workspace-creator';
import { ScrollArea } from '../ui/scroll-area';

interface WorkspaceDropdownProps {
  privateWorkspaces: workspace[] | [];
  sharedWorkspaces: workspace[] | [];
  collaboratingWorkspaces: workspace[] | [];
  defaultValue: string;
}

const WorkspaceDropdown: React.FC<WorkspaceDropdownProps> = ({
  privateWorkspaces,
  collaboratingWorkspaces,
  sharedWorkspaces,
  defaultValue,
}) => {
  const { dispatch, state } = useAppState();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!state.workspaces.length) {
      dispatch({
        type: 'SET_WORKSPACES',
        payload: {
          workspaces: [
            ...privateWorkspaces,
            ...sharedWorkspaces,
            ...collaboratingWorkspaces,
          ].map((workspace) => ({ ...workspace, folders: [] })),
        },
      });
    }
  }, [
    privateWorkspaces,
    collaboratingWorkspaces,
    sharedWorkspaces,
    dispatch,
    state.workspaces.length,
  ]);

  const selectedOption = useMemo(
    () =>
      state.workspaces.find((workspace) => workspace.id === defaultValue),
    [state.workspaces, defaultValue]
  );

  const handleSelect = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative w-full text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left"
      >
        {selectedOption ? (
          <SelectedWorkspace workspace={selectedOption} />
        ) : (
          'Select a workspace'
        )}
      </button>
      {isOpen && (
        <div
          className="absolute
          top-full
          left-0
          w-full
          z-50
          mt-2
          rounded-md
          shadow-xl
          bg-black/10
          backdrop-blur-lg
          border-[1px]
          border-muted
          overflow-hidden
        "
        >
          <ScrollArea className="h-[200px]">
            <div className="rounded-md flex flex-col">
              <div className="p-2">
                {!!privateWorkspaces.length && (
                  <div className="flex flex-col gap-1">
                    <p className="text-muted-foreground text-xs uppercase font-bold p-2">
                      Private
                    </p>
                    <hr className="opacity-10 mb-1 bg-muted border-muted" />
                    {privateWorkspaces.map((option) => (
                      <SelectedWorkspace
                        key={option.id}
                        workspace={option}
                        onClick={handleSelect}
                      />
                    ))}
                  </div>
                )}
                {!!sharedWorkspaces.length && (
                  <div className="flex flex-col gap-1 mt-4">
                    <p className="text-muted-foreground text-xs uppercase font-bold p-2">
                      Shared
                    </p>
                    <hr className="border-muted mb-1" />
                    {sharedWorkspaces.map((option) => (
                      <SelectedWorkspace
                        key={option.id}
                        workspace={option}
                        onClick={handleSelect}
                      />
                    ))}
                  </div>
                )}
                {!!collaboratingWorkspaces.length && (
                  <div className="flex flex-col gap-1 mt-4">
                    <p className="text-muted-foreground text-xs uppercase font-bold p-2">
                      Collaborating
                    </p>
                    <hr className="border-muted mb-1" />
                    {collaboratingWorkspaces.map((option) => (
                      <SelectedWorkspace
                        key={option.id}
                        workspace={option}
                        onClick={handleSelect}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
          <div className="p-2 border-t border-muted">
            <CustomDialogTrigger
              header="Create A Workspace"
              content={<WorkspaceCreator />}
              description="Workspaces give you the power to collaborate with others. You can change your workspace privacy settings after creating the workspace too."
            >
              <div
                className="flex 
                transition-all 
                hover:bg-muted/50
                justify-center 
                items-center 
                gap-2 
                p-2 
                w-full
                border
                border-muted
                rounded-md
                text-sm
                font-medium"
              >
                <article
                  className="text-slate-500 
                  rounded-full
                   bg-slate-800/50
                   w-4 
                   h-4 
                   flex 
                   items-center 
                   justify-center"
                >
                  <Plus className="w-3 h-3" />
                </article>
                Create workspace
              </div>
            </CustomDialogTrigger>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceDropdown;
