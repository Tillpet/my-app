import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        liquidGlass: [
          "relative overflow-hidden rounded-full font-semibold tracking-wider text-white/95",
          "border-t border-l border-white/20 border-b border-r border-white/5",
          "bg-white/5 backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,0.3)]",
          "transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",

          // 悬停反馈
          "hover:bg-white/10 hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)] hover:text-white",

          // 点击反馈
          "active:translate-y-0 active:shadow-[0_10px_20px_rgba(0,0,0,0.3)]",

          // 悬停时的按钮内部闪光丝滑流体效果 (利用 ::before)
          "before:absolute before:top-0 before:-left-[100%] before:w-full before:height-full before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent before:transition-all before:duration-700 hover:before:left-[100%]",

          // 💥 核心：利用 ::after 伪元素在按钮正后方生成液态流体背景
          // 使用 mix-blend-mode 和 blur 创造有机的彩色流动感
          "after:absolute after:inset-0 after:-z-10 after:opacity-60 after:blur-xl after:pointer-events-none",
          // 使用 Tailwind 任意值写一个极其丝滑的不规则流体动画
          "after:bg-[radial-gradient(at_20%_20%,#ff007f_0px,transparent_50%),radial-gradient(at_80%_80%,#00dfd8_0px,transparent_50%)]",
          "after:animate-liquid",
        ].join(" "),
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
