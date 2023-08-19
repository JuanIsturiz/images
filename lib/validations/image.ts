import { z } from "zod";

export const ImageValidation = z.object({
  imageUrl: z.string().url().nonempty(),
  title: z.string(),
  author: z.string().nonempty(),
});
