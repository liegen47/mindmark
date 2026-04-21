"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdatePasswordSchema } from "@/lib/types";
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
import { actionUpdatePassword } from "@/lib/server-actions/auth-actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const ResetPasswordPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [submitError, setSubmitError] = useState("");

  const form = useForm<z.infer<typeof UpdatePasswordSchema>>({
    mode: "onChange",
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof UpdatePasswordSchema>) => {
    const { error } = await actionUpdatePassword(values);
    if (error) {
      setSubmitError(error.message);
      return;
    }
    toast({
      title: "Success",
      description: "Password updated successfully. You can now login.",
    });
    router.replace("/login");
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
        Enter your new password below.
      </FormDescription>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            disabled={isLoading}
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="New Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={isLoading}
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    {...field}
                  />
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
            {!isLoading ? "Reset Password" : <Loader />}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordPage;
