import { z } from "zod";

export const CreateChecklistSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Checklist title is required.")
    .max(255, "Title cannot exceed 255 characters."),
  description: z.string().trim().max(1000, "Description cannot exceed 1000 characters.").optional().nullable(),
});

export const UpdateChecklistSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Checklist title is required.")
    .max(255, "Title cannot exceed 255 characters.")
    .optional(),
  description: z.string().trim().max(1000, "Description cannot exceed 1000 characters.").optional().nullable(),
});

export const ChecklistItemSchema = z.object({
  checklist_id: z.string().uuid("Invalid checklist ID."),
  title: z
    .string()
    .trim()
    .min(1, "Item title is required.")
    .max(500, "Item title cannot exceed 500 characters."),
  is_checked: z.boolean().optional(),
  position: z.number().optional(),
});
