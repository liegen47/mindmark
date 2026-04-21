// import { Socket, Server as NetServer } from 'net';
// import { Server as SocketIOServer } from 'socket.io';
// import { NextApiResponse } from 'next';
import { z } from 'zod';

export const FormSchema = z.object({
  email: z.string().describe('Email').email('Invalid Email'),
  password: z.string().describe('Password').min(1, 'Password is required'),
});

export const CreateWorkspaceFormSchema = z.object({
  workspaceName: z
    .string()
    .describe('Workspace Name')
    .min(1, 'Workspace name must be min of 1 character'),
  logo: z.any(),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid Email'),
});

export const UpdatePasswordSchema = z
  .object({
    password: z.string().describe('Password').min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().describe('Confirm Password').min(6, 'Password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// export const UploadBannerFormSchema = z.object({
//   banner: z.string().describe('Banner Image'),
// });

// export type NextApiResponseServerIo = NextApiResponse & {
//   socket: Socket & {
//     server: NetServer & {
//       io: SocketIOServer;
//     };
//   };
// };
