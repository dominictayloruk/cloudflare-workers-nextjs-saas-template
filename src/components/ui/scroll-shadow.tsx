"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ScrollShadowProps
  extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  isEnabled?: boolean;
}

function ScrollShadow({
  className,
  orientation = "vertical",
  isEnabled,
  children,
  ...props
}: ScrollShadowProps) {
  return (
    <div
      className={cn(
        "overflow-auto",
        orientation === "vertical" && "overflow-y-auto overflow-x-hidden",
        orientation === "horizontal" && "overflow-x-auto overflow-y-hidden",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { ScrollShadow };
