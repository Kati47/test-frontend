import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: Readonly<React.HTMLAttributes<HTMLDivElement>>) {
  return <div className={cn("rounded-[12px] border border-[#BBBBD0]/70 bg-[#FDFCFD] shadow-[0_8px_24px_rgba(30,41,59,0.08)] transition-all duration-200", className)} {...props} />;
}

export function CardHeader({
  className,
  ...props
}: Readonly<React.HTMLAttributes<HTMLDivElement>>) {
  return <div className={cn("border-b border-[#BBBBD0]/60 px-5 py-4", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: Readonly<React.HTMLAttributes<HTMLDivElement>>) {
  return <div className={cn("text-base font-semibold text-[#1E293B]", className)} {...props} />;
}

export function CardContent({
  className,
  ...props
}: Readonly<React.HTMLAttributes<HTMLDivElement>>) {
  return <div className={cn("px-5 py-4", className)} {...props} />;
}
