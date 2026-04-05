import { cn } from "@/lib/utils";
import type { FicheStatus } from "@/types/fiche";

const statusClasses: Record<FicheStatus, string> = {
  NEW: "bg-[#ED4A52] text-[#FDFCFD]",
  ASSIGNED: "bg-[#2B4B83] text-[#FDFCFD]",
  IN_PROGRESS: "bg-[#EAB308] text-[#1E293B]",
  CLOSED: "bg-[#94A3B8] text-[#FDFCFD]",
};

export function StatusBadge({
  status,
  className,
}: Readonly<{ status: FicheStatus; className?: string }>) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide shadow-[0_6px_14px_rgba(30,41,59,0.08)] transition-transform duration-200 hover:-translate-y-0.5",
        statusClasses[status],
        className,
      )}
    >
      {status}
    </span>
  );
}
