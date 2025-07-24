import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Progress = forwardRef(({ className, value = 0, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-gray-200",
        className
      )}
      {...props}
    >
      <div
        className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`
        }}
      />
    </div>
  );
});

Progress.displayName = "Progress";

export default Progress;