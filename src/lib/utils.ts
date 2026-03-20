import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .trim();
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export const COURSE_TYPE_LABELS: Record<string, string> = {
  CORE: "Core",
  ELECTIVE: "Elective",
  SPECIALIZATION: "Specialization",
  CAPSTONE: "Capstone",
  INDUSTRY: "Industry",
};

export const COURSE_TYPE_COLORS: Record<string, string> = {
  CORE: "bg-navy text-white",
  ELECTIVE: "bg-gray-200 text-gray-800",
  SPECIALIZATION: "bg-teal-600 text-white",
  CAPSTONE: "bg-gold text-navy-dark",
  INDUSTRY: "bg-green-600 text-white",
};

export const LEVEL_COLORS: Record<string, string> = {
  Bachelor: "bg-navy-50 text-navy",
  Masters: "bg-gold-50 text-navy-dark",
  PhD: "bg-purple-50 text-purple-800",
  Diploma: "bg-gray-100 text-gray-800",
};
