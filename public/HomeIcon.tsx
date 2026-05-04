import { cn } from "@/lib/utils";

export default function HomeIcon({ className }: { className: string }) {
  return (
    <svg
      className={cn("w-4 h-4", className)}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h4a1 1 0 001-1v-3h2v3a1 1 0 001 1h4a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  );
}
