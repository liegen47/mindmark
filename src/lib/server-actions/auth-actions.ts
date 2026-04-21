'use server';

import { z } from 'zod';
import { FormSchema } from '../types';
import { createClient } from '@/utils/supabase/server';

export async function actionLoginUser({
  email,
  password,
}: z.infer<typeof FormSchema>) {
  const supabase = await createClient();
  const response = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return response;
}

export async function actionSignUpUser(formData: z.infer<typeof FormSchema>) {
  console.log('actionSignUpUser payload', formData);
  const parsed = FormSchema.safeParse({
    email: formData?.email?.trim(),
    password: formData?.password,
  });

  if (!parsed.success) {
    return {
      error: {
        message: parsed.error.issues[0]?.message ?? 'Invalid signup payload',
      },
    };
  }

  const supabase = await createClient();
  const response = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}api/auth/callback`,
    },
  });
  return response;
}

