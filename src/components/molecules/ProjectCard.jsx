import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Progress from "@/components/atoms/Progress";
import { Avatar, AvatarFallback } from "@/components/atoms/Avatar";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const ProjectCard = ({ project, onClick }) => {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "completed":
        return "default";
      case "on-hold":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:scale-[1.02] transition-all duration-200 bg-gradient-to-br from-white to-gray-50/50"
      onClick={onClick}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {project.name}
          </CardTitle>
          <Badge variant={getStatusVariant(project.status)}>
            {project.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">
          {project.description}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-semibold text-primary">{project.progress || 0}%</span>
          </div>
          <Progress value={project.progress || 0} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Users" className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{project.teamMembers?.length || 0} members</span>
          </div>
          
          <div className="flex -space-x-2">
            {project.teamMembers?.slice(0, 3).map((member, index) => (
              <Avatar key={index} className="h-6 w-6 border border-white">
                <AvatarFallback className="text-xs">
                  {getInitials(member)}
                </AvatarFallback>
              </Avatar>
            ))}
            {project.teamMembers?.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-gray-200 border border-white flex items-center justify-center">
                <span className="text-xs text-gray-600 font-medium">
                  +{project.teamMembers.length - 3}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <ApperIcon name="Calendar" className="h-3 w-3" />
            <span>Created {format(new Date(project.createdAt), "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <ApperIcon name="CheckSquare" className="h-3 w-3" />
              <span>{project.taskCounts?.completed || 0}/{project.taskCounts?.total || 0}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;