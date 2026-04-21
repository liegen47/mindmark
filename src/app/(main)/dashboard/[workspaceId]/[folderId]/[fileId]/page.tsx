export const dynamic = 'force-dynamic';

import React from 'react';
import { getFiles } from '@/lib/supabase/queries';
import { redirect } from 'next/navigation';

const File = async ({
  params,
}: {
  params: Promise<{ fileId: string; folderId: string }>;
}) => {
  const { folderId, fileId } = await params;
  const { data, error } = await getFiles(folderId);
  const file = data?.find((item) => item.id === fileId);
  if (error || !file) redirect('/dashboard');

  return (
    <div className="relative p-6">
      <h2 className="text-xl font-semibold">{file.title}</h2>
      <p className="text-muted-foreground mt-2">
        File view is ready; editor module can be migrated next.
      </p>
    </div>
  );
};

export default File;
