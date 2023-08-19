"use client";

import { ImageValidation } from "@/lib/validations/image";
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
import { useRef, useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { isBase64Image } from "@/lib/utils";
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

  const [files, setFiles] = useState<File[]>([]);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const { startUpload } = useUploadThing("media");

  const form = useForm<z.infer<typeof ImageValidation>>({
    resolver: zodResolver(ImageValidation),
  });

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setImage(null);
    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        setImageToCrop(imageDataUrl);
      };
      fileReader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof ImageValidation>) {
    if (!image) return;

    let uploadedImage;
    const blob = image;
    const hasImageChanged = isBase64Image(blob);

    if (hasImageChanged) {
      const imgRes = await startUpload(files);
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
      author: userId,
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
          setImage={(img: string | null) => setImage(img)}
        />
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />
            <p onClick={() => fileRef.current?.click()}>SELECT FILE HERE</p>
          </div>
          {image && <Image src={image} alt="Image" width={400} height={400} />}
          {/* <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="mb-4">
                <div className="">
                  <FormLabel className="flex items-center justify-center bg-dark-4">
                    {image ? (
                      <Image
                        src={image}
                        alt="Profile Photo"
                        width={400}
                        height={400}
                        priority
                        className="object-contain cursor-pointer"
                      />
                    ) : (
                      <Image
                        src={"/assets/profile.svg"}
                        alt="Profile Photo"
                        width={400}
                        height={400}
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
          /> */}
        </form>
      </Form>
    </>
  );
};

export default CreateImageForm;
