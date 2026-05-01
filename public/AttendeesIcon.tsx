import { cn } from "@/lib/utils";

export default function AttendeesIcon({ className }: { className: string }) {
  return (
    <svg
      className={cn("w-4 h-4 mr-2", className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}
