"use client";

import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";

interface Image {
  title: string;
  _id: string;
  imageUrl: string;
  author: {
    id: string;
    name: string;
    image: string;
  };
  createdAt: string;
}

interface ImageListProps {
  images: Image[] | null;
}

const ImageList: React.FC<ImageListProps> = ({ images }) => {
  return (
    <ScrollArea className="h-[34rem]">
      <div className="flex justify-center flex-wrap gap-4">
        {images?.map((image) => (
          <div key={JSON.parse(image._id)} className="w-60 h-60 border-2">
            <Image
              src={image.imageUrl}
              alt={image.title}
              width={240}
              height={240}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ImageList;
