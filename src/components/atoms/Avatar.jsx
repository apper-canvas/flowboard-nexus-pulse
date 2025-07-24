import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Avatar = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm",
        className
      )}
      {...props}
    />
  );
});

Avatar.displayName = "Avatar";

const AvatarImage = forwardRef(({ className, ...props }, ref) => {
  return (
    <img
      ref={ref}
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  );
});

AvatarImage.displayName = "AvatarImage";

const AvatarFallback = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-medium text-white",
        className
      )}
      {...props}
    />
  );
});

AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };