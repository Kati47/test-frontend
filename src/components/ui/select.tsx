import * as React from "react";
import { cn } from "@/lib/utils";

export function Select({
  className,
  ...props
}: Readonly<React.SelectHTMLAttributes<HTMLSelectElement>>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-lg border border-[#BBBBD0] bg-[#FDFCFD] px-3 py-2 text-sm text-[#1E293B] shadow-[0_4px_14px_rgba(43,75,131,0.04)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B4B83] focus-visible:border-[#2B4B83]",
        className,
      )}
      {...props}
    />
  );
}
