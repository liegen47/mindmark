export const dynamic = 'force-dynamic';

import { getWorkspaceDetails } from '@/lib/supabase/queries';
import { redirect } from 'next/navigation';
import React from 'react';

const Workspace = async ({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) => {
  const { workspaceId } = await params;
  const { data, error } = await getWorkspaceDetails(workspaceId);
  if (error || !data.length) redirect('/dashboard');
  return (
    <div className="relative p-6">
      <h1 className="text-2xl font-semibold">{data[0]?.title ?? 'Workspace'}</h1>
      <p className="text-muted-foreground mt-2">
        Select a folder from the sidebar to continue.
      </p>
    </div>
  );
};

export default Workspace;
