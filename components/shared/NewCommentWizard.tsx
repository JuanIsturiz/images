"use client";

import { CommentValidation } from "@/lib/validations/comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { createComment } from "@/lib/actions/comment.actions";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NewCommentWizardProps {
  userId: string;
  imageId: string;
  imageOwner: string;
}

const NewCommentWizard: React.FC<NewCommentWizardProps> = ({
  userId,
  imageId,
  imageOwner,
}) => {
  const pathname = usePathname();
  const [isSubmited, setIsSubmited] = useState(false);
  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
  });

  async function onSubmit(values: z.infer<typeof CommentValidation>) {
    setIsSubmited(true);
    if (isSubmited) return;
    const res = await createComment({
      author: userId,
      toUser: imageOwner,
      content: values.content,
      image: imageId,
      path: pathname,
    });

    if (res) {
      form.reset({
        content: "",
      });
    }
    setIsSubmited(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-2">
        <FormField
          name="content"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  disabled={isSubmited}
                  type="text"
                  placeholder="Add a new comment here..."
                  {...field}
                  autoComplete="off"
                  className="w-full focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default NewCommentWizard;
