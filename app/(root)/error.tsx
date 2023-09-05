"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <section className="w-full mt-14 px-8 sm:px-1 mb-14 sm:mb-20 lg:mb-2 lg:ml-52">
      <div className="w-full flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle size={32} />
          <h2 className="text-2xl">Something went wrong!</h2>
        </div>
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </Button>
      </div>
    </section>
  );
}
