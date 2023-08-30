import { z } from "zod";

export const CommentValidation = z.object({
  content: z.string().min(3).max(50).nonempty(),
});
