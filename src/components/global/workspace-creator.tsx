"use client";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { User, workspace } from "@/lib/supabase/supabase.types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectGroup } from "@radix-ui/react-select";
import { Lock, Plus, Share } from "lucide-react";
import { Button } from "../ui/button";
import { v4 } from "uuid";
import { addCollaborators, createWorkspace } from "@/lib/supabase/queries";
import CollaboratorSearch from "./collaborator-search";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useToast } from "../ui/use-toast";

const WorkspaceCreator = () => {
  const { user } = useSupabaseUser();
  const { toast } = useToast();
  const router = useRouter();
  const [permissions, setPermissions] = useState("private");
  const [title, setTitle] = useState("");
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addCollaborator = (user: User) => {
    setCollaborators([...collaborators, user]);
  };

  const removeCollaborator = (user: User) => {
    setCollaborators(collaborators.filter((c) => c.id !== user.id));
  };

  const createItem = async () => {
    setIsLoading(true);
    const uuid = v4();
    if (user?.id) {
      const newWorkspace: workspace = {
        data: null,
        createdAt: new Date().toISOString(),
        iconId: "💼",
        id: uuid,
        inTrash: "",
        title,
        workspaceOwner: user.id,
        logo: null,
        bannerUrl: "",
      };
      if (permissions === "private") {
        toast({ title: "Success", description: "Created the workspace" });
        await createWorkspace(newWorkspace);
        router.refresh();
      }
      if (permissions === "shared") {
        toast({ title: "Success", description: "Created the workspace" });
        await createWorkspace(newWorkspace);
        await addCollaborators(collaborators, uuid);
        router.refresh();
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 w-full">
        <div className="flex flex-col gap-6 py-4 px-6">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="name"
              className="text-sm font-medium text-foreground"
            >
              Workspace Name
            </Label>
            <Input
              name="name"
              value={title}
              placeholder="e.g. My Awesome Project"
              className="h-10"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="permissions"
              className="text-sm font-medium text-foreground"
            >
              Permissions
            </Label>
            <Select
              onValueChange={(val) => {
                setPermissions(val);
              }}
              defaultValue={permissions}
            >
              <SelectTrigger className="w-full h-16">
                <SelectValue placeholder="Select permissions" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectGroup>
                  <SelectItem
                    value="private"
                    className="cursor-pointer py-3"
                  >
                    <div className="flex items-center gap-4 pr-4">
                      <Lock className="w-5 h-5 my-auto text-muted-foreground" />
                      <div className="flex flex-col text-left">
                        <span className="font-medium text-foreground">Private</span>
                        <span className="text-xs text-muted-foreground whitespace-normal leading-relaxed">
                          Only you can see this workspace.
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="shared"
                    className="cursor-pointer py-3"
                  >
                    <div className="flex items-start gap-4 pr-4">
                      <Share className="w-5 h-5 mt-0.5 text-muted-foreground" />
                      <div className="flex flex-col text-left">
                        <span className="font-medium text-foreground">Shared</span>
                        <span className="text-xs text-muted-foreground whitespace-normal leading-relaxed">
                          You can invite others to collaborate.
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {permissions === 'shared' && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-foreground">
                  Collaborators
                </Label>
                <CollaboratorSearch
                  existingCollaborators={collaborators}
                  getCollaborator={(user) => {
                    addCollaborator(user);
                  }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-10 gap-2 border-dashed"
                  >
                    <Plus className="w-4 h-4" />
                    Add Collaborators
                  </Button>
                </CollaboratorSearch>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {collaborators.length} Collaborator{collaborators.length !== 1 ? 's' : ''}
                </span>
                <div className="h-[180px] w-full rounded-xl border border-border bg-muted/20 overflow-hidden">
                  <ScrollArea className="h-full w-full">
                    {collaborators.length ? (
                      <div className="flex flex-col divide-y divide-border">
                        {collaborators.map((c) => (
                          <div
                            className="p-3 flex justify-between items-center hover:bg-muted/30 transition-colors"
                            key={c.id}
                          >
                            <div className="flex gap-3 items-center">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src="/avatars/7.png" />
                                <AvatarFallback className="text-[10px] font-bold">
                                  {c.email?.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-foreground truncate max-w-[180px]">
                                {c.email}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => removeCollaborator(c)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center p-8 text-center gap-2 min-h-[178px]">
                        <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground">
                          <Share className="w-5 h-5" />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          No collaborators added yet
                        </span>
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-6 pt-2 border-t border-border">
        <Button
          type="button"
          disabled={
            !title ||
            (permissions === 'shared' && collaborators.length === 0) ||
            isLoading
          }
          className="w-full h-11 shadow-lg shadow-primary/20"
          onClick={createItem}
        >
          {!isLoading ? 'Create Workspace' : 'Creating...'}
        </Button>
      </div>
    </div>
  );
};

export default WorkspaceCreator;
