import { z } from "zod";

export const TaskStatusEnum = z.enum(["inbox", "todo", "in_progress", "done"]);
export const TaskPriorityEnum = z.enum(["none", "low", "medium", "high"]);

export const CreateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Task title is required.")
    .max(500, "Task title cannot exceed 500 characters."),
  description: z.string().trim().max(5000, "Description cannot exceed 5000 characters.").optional().nullable(),
  status: TaskStatusEnum.default("inbox"),
  priority: TaskPriorityEnum.default("none"),
  due_at: z.string().datetime({ offset: true }).optional().nullable().or(z.literal("")),
  parent_task_id: z.string().uuid().optional().nullable(),
});

export const UpdateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Task title is required.")
    .max(500, "Task title cannot exceed 500 characters.")
    .optional(),
  description: z.string().trim().max(5000, "Description cannot exceed 5000 characters.").optional().nullable(),
  status: TaskStatusEnum.optional(),
  priority: TaskPriorityEnum.optional(),
  due_at: z.string().datetime({ offset: true }).optional().nullable().or(z.literal("")),
  position: z.number().optional(),
});

export const CreateSubtaskSchema = z.object({
  parent_task_id: z.string().uuid("Invalid parent task ID."),
  title: z
    .string()
    .trim()
    .min(1, "Subtask title is required.")
    .max(500, "Subtask title cannot exceed 500 characters."),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type CreateSubtaskInput = z.infer<typeof CreateSubtaskSchema>;
