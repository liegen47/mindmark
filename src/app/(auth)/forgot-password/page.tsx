"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema } from "@/lib/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../../public/mindmarklogo.svg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/global/Loader";
import { actionForgotPassword } from "@/lib/server-actions/auth-actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MailCheck } from "lucide-react";

const ForgotPasswordPage = () => {
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    mode: "onChange",
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof ForgotPasswordSchema>) => {
    const { error } = await actionForgotPassword(values.email);
    if (error) {
      setSubmitError(error.message);
      return;
    }
    setSuccess(true);
  };

  return (
    <div className="w-full sm:justify-center sm:w-[400px] space-y-6 flex flex-col">
      <Link href="/" className="w-full flex justify-left items-center">
        <Image src={Logo} alt="Mindmark Logo" width={50} height={50} />
        <span className="font-semibold dark:text-white text-4xl first-letter:ml-2">
          Mindmark.
        </span>
      </Link>
      <FormDescription className="text-foreground/60">
        Enter your email to receive a password reset link.
      </FormDescription>

      {success ? (
        <Alert className="bg-primary/10 border-primary/20">
          <MailCheck className="h-4 w-4" />
          <AlertTitle>Check your email</AlertTitle>
          <AlertDescription>
            We&apos;ve sent a password reset link to your email address.
          </AlertDescription>
        </Alert>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {submitError && <FormMessage>{submitError}</FormMessage>}
            <Button
              type="submit"
              className="w-full p-6"
              size="lg"
              disabled={isLoading}
            >
              {!isLoading ? "Send Reset Link" : <Loader />}
            </Button>
          </form>
        </Form>
      )}
      <Link href="/login" className="text-primary self-center text-sm">
        Back to Login
      </Link>
    </div>
  );
};

export default ForgotPasswordPage;
