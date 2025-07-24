import React from "react";
import { Avatar, AvatarFallback } from "@/components/atoms/Avatar";

const TeamMemberAvatar = ({ member, size = "md", showName = false, className }) => {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const sizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
    xl: "h-12 w-12"
  };

  if (showName) {
    return (
      <div className="flex items-center space-x-2">
        <Avatar className={`${sizes[size]} ${className}`}>
          <AvatarFallback>
            {getInitials(member)}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-gray-700">{member}</span>
      </div>
    );
  }

  return (
    <Avatar className={`${sizes[size]} ${className}`}>
      <AvatarFallback>
        {getInitials(member)}
      </AvatarFallback>
    </Avatar>
  );
};

export default TeamMemberAvatar;