"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { profileSchema } from "@/lib/validations";
import { updateUser } from "@/lib/actions/user.actions";

type ProfileFormProps = {
  userId: string;
  initialValues?: z.infer<typeof profileSchema>;
};

const ProfileForm = ({ userId, initialValues }: ProfileFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: initialValues?.bio || "",
      location: initialValues?.location || "",
      personalWebsite: initialValues?.personalWebsite || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await updateUser({
        clerkId: userId,
        updateData: values,
        path: `/profile/${userId}`,
      });
      toast({
        title: "Profile updated successfully",
        description: "Your profile changes have been saved.",
        className: "bg-green-500 text-white border-none",
      });
      router.push(`/profile/${userId}`);
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "Something went wrong, please try again later.",
        className: "bg-red-500 text-white border-none",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="form-label">Bio</FormLabel>
              <FormControl>
                <Textarea
                  className="input-field"
                  rows={4}
                  placeholder="Tell us about yourself"
                  {...field}
                />
              </FormControl>
              <FormDescription className="form-description">
                A short description about you (10-300 characters).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="form-label">Location</FormLabel>
              <FormControl>
                <Input
                  className="input-field"
                  placeholder="Your city or country"
                  {...field}
                />
              </FormControl>
              <FormDescription className="form-description">
                Where you're based (3-150 characters).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="personalWebsite"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="form-label">Personal Website</FormLabel>
              <FormControl>
                <Input
                  className="input-field"
                  placeholder="https://yourwebsite.com"
                  {...field}
                />
              </FormControl>
              <FormDescription className="form-description">
                Link to your portfolio or personal website.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full md:w-fit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
