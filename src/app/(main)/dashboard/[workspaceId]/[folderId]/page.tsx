export const dynamic = 'force-dynamic';

import React from 'react';
import { getFiles } from '@/lib/supabase/queries';
import { redirect } from 'next/navigation';

const Folder = async ({
  params,
}: {
  params: Promise<{ folderId: string }>;
}) => {
  const { folderId } = await params;
  const { data, error } = await getFiles(folderId);
  if (error || !data) redirect('/dashboard');

  return (
    <div className="relative p-6">
      <h2 className="text-xl font-semibold">Folder</h2>
      <p className="text-muted-foreground mt-2">
        {data.length} file{data.length === 1 ? '' : 's'} in this folder.
      </p>
    </div>
  );
};

export default Folder;
