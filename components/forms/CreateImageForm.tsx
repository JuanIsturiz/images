"use client";

import { ImageValidation } from "@/lib/validations/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { createImage } from "@/lib/actions/image.actions";
import ImageCropper from "../shared/crop/ImageCropper";
import Image from "next/image";

interface CreateImageFormProps {
  userId: string;
}

const CreateImageForm: React.FC<CreateImageFormProps> = ({ userId }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const fileRef = useRef<HTMLInputElement | null>(null);

  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [image, setImage] = useState<{ file: any; url: any } | null>(null);
  const { startUpload } = useUploadThing("media");

  const [isNoImage, setIsNoImage] = useState(false);

  useEffect(() => {
    setIsNoImage(false);
  }, [image]);

  const form = useForm<z.infer<typeof ImageValidation>>({
    resolver: zodResolver(ImageValidation),
  });

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setImage(null);
    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        setImageToCrop(imageDataUrl);
      };
      fileReader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof ImageValidation>) {
    if (!image) {
      setIsNoImage(true);
      return;
    }
    let uploadedImage;
    if (image.file) {
      const imgRes = await startUpload([image.file]);
      if (imgRes && imgRes[0].url) {
        uploadedImage = imgRes[0].url;
      }
    }
    if (!uploadedImage) {
      toast({
        duration: 2000,
        variant: "destructive",
        description: "Failed to post image.",
      });
      return;
    }
    await createImage({
      author: JSON.parse(userId),
      imageUrl: uploadedImage,
      title: values.title,
      path: pathname,
    });
    toast({
      className: "mt-2",
      duration: 2000,
      description: "Image posted successfully.",
    });
    router.push("/");
  }

  const handleCrop = (img: string | null) => {
    setImageToCrop(img);
  };

  return (
    <>
      {imageToCrop && !image && (
        <ImageCropper
          imageToCrop={imageToCrop}
          setImageToCrop={handleCrop}
          setImage={(img: { file: any; url: any } | null) => setImage(img)}
        />
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex gap-2 w-5/6 p-2 dark:bg-zinc-900 rounded border shadow-lg dark:border-zinc-800"
        >
          <div>
            {!image && (
              <Image
                src={"/assets/profile.svg"}
                alt="Image"
                width={400}
                height={400}
                className="rounded-sm shadow-lg"
              />
            )}
            {image && (
              <Image
                src={image.url}
                alt="Image"
                width={400}
                height={400}
                className="rounded-sm shadow-lg"
              />
            )}
            <div className="mt-4">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
              <div className="flex gap-2 items-center">
                <p>Select your image</p>
                <Button
                  type="button"
                  className="font-medium"
                  onClick={() => fileRef.current?.click()}
                >
                  Browse...
                </Button>
              </div>
            </div>
          </div>
          <div className="w-5/6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel className="text-md">Title</FormLabel>
                  <FormControl>
                    <Input
                      className="focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                      type="text"
                      placeholder="Give your image a title"
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
            <div className="mt-2">
              {isNoImage && (
                <p className=" text-red-500">! Please select a valid Image</p>
              )}
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default CreateImageForm;
