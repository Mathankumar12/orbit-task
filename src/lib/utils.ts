import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
}

export function isOverdue(dateString: string | null | undefined): boolean {
  if (!dateString) return false;
  const d = new Date(dateString);
  const now = new Date();
  // Clear time component for date-only comparison
  d.setHours(23, 59, 59, 999);
  return d < now;
}

export function isDueToday(dateString: string | null | undefined): boolean {
  if (!dateString) return false;
  const d = new Date(dateString);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}
