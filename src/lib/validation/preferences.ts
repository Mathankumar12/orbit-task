import { z } from "zod";

export const UserPreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).optional(),
  density: z.enum(["comfortable", "compact"]).optional(),
  accent: z.enum(["indigo", "blue", "emerald", "violet", "rose", "amber"]).optional(),
  default_view: z.enum(["today", "tasks", "board", "checklists", "notes"]).optional(),
  sidebar_collapsed: z.boolean().optional(),
});

export type UserPreferencesInput = z.infer<typeof UserPreferencesSchema>;
