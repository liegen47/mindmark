'use server';

import { z } from 'zod';
import { ForgotPasswordSchema, FormSchema, UpdatePasswordSchema } from '../types';
import { createClient } from '@/utils/supabase/server';

export async function actionLoginUser(formData: z.infer<typeof FormSchema>) {
  const email = formData.email;
  const password = formData.password;
  const supabase = await createClient();
  const response = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return response;
}

export async function actionSignUpUser({ email, password }: z.infer<typeof FormSchema>) {
  const supabase = await createClient();
  const response = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}api/auth/callback`,
    },
  });
  return response;
}

export async function actionForgotPassword(email: string) {
  const parsed = ForgotPasswordSchema.safeParse({ email });
  if (!parsed.success) {
    return {
      error: {
        message: parsed.error.issues[0]?.message ?? 'Invalid email',
      },
    };
  }

  const supabase = await createClient();
  const response = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}api/auth/callback?next=/reset-password`,
  });
  return response;
}

export async function actionUpdatePassword(formData: z.infer<typeof UpdatePasswordSchema>) {
  const parsed = UpdatePasswordSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      error: {
        message: parsed.error.issues[0]?.message ?? 'Invalid password payload',
      },
    };
  }

  const supabase = await createClient();
  const response = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  return response;
}

