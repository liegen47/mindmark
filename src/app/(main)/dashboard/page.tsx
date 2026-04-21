import React from 'react';
import db from '@/lib/supabase/db';
import { redirect } from 'next/navigation';
import DashboardSetup from '@/components/dashboard-setup/dashboard-setup';
import { getUserSubscriptionStatus } from '@/lib/supabase/queries';
import { createClient } from '@/utils/supabase/server';

const DashboardPage = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  let workspace: Awaited<ReturnType<typeof db.query.workspaces.findFirst>>;
  try {
    workspace = await db.query.workspaces.findFirst({
      where: (workspace, { eq }) => eq(workspace.workspaceOwner, user.id),
    });
  } catch (error) {
    console.error('Dashboard workspace query failed', error);
  }

  const { data: subscription, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id);

  if (subscriptionError) {
    console.error('Dashboard subscription query failed', subscriptionError);
  }

  if (!workspace)
    return (
      <div
        className="bg-background
        h-screen
        w-screen
        flex
        justify-center
        items-center
  "
      >
        <DashboardSetup
          user={user}
          subscription={subscription ?? null}
        />
      </div>
    );

  redirect(`/dashboard/${workspace.id}`);
};

export default DashboardPage;
