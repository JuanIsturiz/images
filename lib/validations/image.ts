import { z } from "zod";

export const ImageValidation = z.object({
  title: z.string(),
});
