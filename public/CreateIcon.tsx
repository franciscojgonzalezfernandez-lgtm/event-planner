import { cn } from "@/lib/utils";

export default function AttendeesIcon({ className }: { className: string }) {
  return (
    <svg
      className={cn("w-8 h-8 mr-2", className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
  );
}
