import { z } from "zod";

export const CreateNoteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Note title is required.")
    .max(255, "Title cannot exceed 255 characters."),
  content: z.string().default(""),
  linked_task_id: z.string().uuid().optional().nullable().or(z.literal("")),
});

export const UpdateNoteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Note title is required.")
    .max(255, "Title cannot exceed 255 characters.")
    .optional(),
  content: z.string().optional(),
  linked_task_id: z.string().uuid().optional().nullable().or(z.literal("")),
});
