import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B4B83] focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-[#2B4B83] text-[#FDFCFD] shadow-[0_10px_22px_rgba(43,75,131,0.14)] hover:-translate-y-0.5 hover:bg-[#23406f]",
        danger: "bg-[#ED4A52] text-[#FDFCFD] shadow-[0_10px_22px_rgba(237,74,82,0.14)] hover:-translate-y-0.5 hover:bg-[#da3b44]",
        outline: "border border-[#2B4B83] text-[#2B4B83] hover:-translate-y-0.5 hover:bg-[#2B4B83] hover:text-[#FDFCFD]",
      },
      size: {
        md: "h-10 px-4 py-2",
        sm: "h-9 px-3",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: Readonly<ButtonProps>) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
