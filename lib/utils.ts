import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Función utilitaria para concatenar clases
export function cn(...inputs: string[]) {
  return twMerge(clsx(inputs));
}
