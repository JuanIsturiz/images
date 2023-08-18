"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";

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
import { UserValidation } from "@/lib/validations/user";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { isBase64Image } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { updateUser } from "@/lib/actions/user.actions";
import { useToast } from "../ui/use-toast";

interface User {
  id: string;
  username: string;
  name: string;
  imageUrl: string;
}

interface OnboardingFormProps {
  user: User;
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({ user }) => {
  const router = useRouter();
  const pathname = usePathname();

  const { toast } = useToast();

  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("media");

  // 1. Define your form.
  const form = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user.imageUrl,
      username: user.username,
      name: user.name,
      bio: "",
    },
  });

  const handleImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";

        fieldChange(imageDataUrl);
      };
      fileReader.readAsDataURL(file);
    }
  };

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof UserValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    const blob = values.profile_photo;
    const hasImageChanged = isBase64Image(blob);

    if (hasImageChanged) {
      const imgRes = await startUpload(files);
      if (imgRes && imgRes[0].url) {
        values.profile_photo = imgRes[0].url;
        toast({
          duration: 2000,
          description: "New profile photo uploaded successfully.",
        });
      }
    }

    await updateUser({
      userId: user.id,
      username: values.username,
      name: values.name,
      bio: values.bio,
      image: values.profile_photo,
      path: pathname,
    });
    toast({
      className: "mt-2",
      duration: 2000,
      description: "User profile updated.",
    });
    if (pathname === "/profile/edit") {
      router.back();
    } else {
      router.push("/");
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-1/2 mx-auto mb-2 p-4 dark:bg-zinc-900 rounded border shadow-lg dark:border-zinc-800"
      >
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="mb-4">
              <div className="flex items-center gap-4">
                <FormLabel className="flex h-24 w-24 items-center justify-center rounded-full bg-dark-4">
                  {field.value ? (
                    <Image
                      src={field.value}
                      alt="Profile Photo"
                      width={96}
                      height={96}
                      priority
                      className="rounded-full object-contain cursor-pointer"
                    />
                  ) : (
                    <Image
                      src={"/assets/profile.svg"}
                      alt="Profile Photo"
                      width={24}
                      height={24}
                      className="object-contain cursor-pointer"
                    />
                  )}
                </FormLabel>
                <FormControl className="flex-1 text-lg">
                  <Input
                    type="file"
                    accept="image/*"
                    placeholder="Upload a photo"
                    className="cursor-pointer border-none !bg-transparent outline-none dark:file:text-zinc-300"
                    onChange={(e) => handleImage(e, field.onChange)}
                  />
                </FormControl>
              </div>
              <FormDescription>This is your profile picture.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel className="text-md">Username</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Your username goes here..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel className="text-md">Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Your name goes here..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel className="text-md">Bio</FormLabel>
              <FormControl>
                <Textarea
                  rows={8}
                  placeholder="Your bio goes here..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default OnboardingForm;
