"use client";

import { useEffect, useState } from "react";
import getCroppedImg from "./utils/cropImage";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

interface ImageCropperProps {
  imageToCrop: string | null;
  setImageToCrop: (img: string | null) => void;
  setImage: (img: string | null) => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  imageToCrop,
  setImageToCrop,
  setImage,
}) => {
  const [open, setOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    if (open) return;
    setOpen(true);
  }, [imageToCrop]);

  const cropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const cropImage = async () => {
    try {
      const { file, url } = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels,
        rotation
      );
      setImage(url);
      setOpen(false);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(false);
        setImageToCrop(null);
        setImage(null);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crop your image</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-80 mx-auto">
          <Cropper
            objectFit="cover"
            aspect={1 / 1}
            image={imageToCrop ?? ""}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropChange={setCrop}
            onCropComplete={cropComplete}
          />
        </div>
        <div>
          <div className="mb-2">
            <p className="text-center mb-1">Zoom</p>
            <Slider
              defaultValue={[1.5]}
              max={3}
              min={0.8}
              step={0.1}
              value={[zoom]}
              onValueChange={(val) => setZoom(val[0])}
            />
          </div>
          <div className="mb-2">
            <p className="text-center mb-1">Rotation</p>
            <Slider
              defaultValue={[0]}
              max={300}
              min={0}
              step={1}
              value={[rotation]}
              onValueChange={(val) => setRotation(val[0])}
            />
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => {
              setImageToCrop(null);
              setImage(null);
            }}
          >
            Cancel
          </Button>
          <Button onClick={cropImage}>Select Image</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropper;
