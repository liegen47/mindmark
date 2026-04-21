'use client';

import { useAppState } from '@/lib/providers/state-provider';
import { Folder } from '@/lib/supabase/supabase.types';
import React, { useEffect } from 'react';
import TooltipComponent from '../global/tooltip-component';
import { FolderPlus, PlusIcon } from 'lucide-react';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { v4 } from 'uuid';
import { createFolder } from '@/lib/supabase/queries';
import { useToast } from '../ui/use-toast';
import { Accordion } from '../ui/accordion';
import Dropdown from './Dropdown';

interface FoldersDropdownListProps {
  workspaceFolders: Folder[];
  workspaceId: string;
}

const FoldersDropdownList: React.FC<FoldersDropdownListProps> = ({
  workspaceFolders,
  workspaceId,
}) => {
  const { state, dispatch, folderId } = useAppState();
  const { toast } = useToast();
  const { subscription } = useSupabaseUser();

  // Update global state when server data changes
  useEffect(() => {
    dispatch({
      type: 'SET_FOLDERS',
      payload: {
        workspaceId,
        folders: workspaceFolders.map((folder) => ({
          ...folder,
          files:
            state.workspaces
              .find((workspace) => workspace.id === workspaceId)
              ?.folders.find((f) => f.id === folder.id)?.files || [],
        })),
      },
    });
  }, [workspaceFolders, workspaceId, dispatch]);

  const folders =
    state.workspaces.find((workspace) => workspace.id === workspaceId)
      ?.folders || [];

  const addFolderHandler = async () => {
    if (folders.length >= 3 && !subscription) {
      return;
    }

    const newFolder: Folder = {
      data: null,
      id: v4(),
      createdAt: new Date().toISOString(),
      title: 'Untitled',
      iconId: '📄',
      inTrash: null,
      workspaceId,
      bannerUrl: '',
    };

    dispatch({
      type: 'ADD_FOLDER',
      payload: { workspaceId, folder: { ...newFolder, files: [] } },
    });

    const { error } = await createFolder(newFolder);

    if (error) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: 'Could not create the folder',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Created folder.',
      });
    }
  };

  return (
    <>
      <div
        className="flex
        sticky
        z-20
        top-0
        bg-background
        w-full
        h-10
        group/title
        justify-between
        items-center
        pr-4
        text-neutrals-8
      "
      >
        <span
          className="text-neutrals-8
          font-bold
          text-xs"
        >
          FOLDERS
        </span>
        <TooltipComponent message="Create Folder">
          <PlusIcon
            onClick={addFolderHandler}
            size={16}
            className="group-hover/title:flex
            hidden
            cursor-pointer
            hover:dark:text-white
          "
          />
        </TooltipComponent>
      </div>
      <Accordion
        type="multiple"
        defaultValue={[folderId || '']}
        className="pb-20"
      >
        {folders.filter((folder) => !folder.inTrash).length > 0 ? (
          folders
            .filter((folder) => !folder.inTrash)
            .map((folder) => (
              <Dropdown
                key={folder.id}
                title={folder.title}
                listType="folder"
                id={folder.id}
                iconId={folder.iconId}
              />
            ))
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center gap-3 mt-4">
            <div className="w-12 h-12 rounded-2xl bg-muted/30 flex items-center justify-center text-muted-foreground/50 border border-dashed border-muted-foreground/20">
              <FolderPlus className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">
                No folders yet
              </p>
              <p className="text-xs text-muted-foreground/60 leading-relaxed px-4">
                Organize your files by creating your first folder.
              </p>
            </div>
            <button
              onClick={addFolderHandler}
              className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 mt-2"
            >
              <PlusIcon className="w-3 h-3" />
              Create your first folder
            </button>
          </div>
        )}
      </Accordion>
    </>
  );
};

export default FoldersDropdownList;
