import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import { Avatar, AvatarFallback } from "@/components/atoms/Avatar";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const TaskCard = ({ task, onClick, ...props }) => {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "secondary";
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";

  return (
    <Card 
      className="task-card cursor-pointer mb-3"
      onClick={onClick}
      {...props}
    >
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900 line-clamp-2">
            {task.title}
          </h4>
          {task.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {task.priority && (
              <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                {task.priority}
              </Badge>
            )}
            {task.progress > 0 && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <ApperIcon name="TrendingUp" className="h-3 w-3" />
                <span>{task.progress}%</span>
              </div>
            )}
          </div>
          
          {task.assignee && (
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {getInitials(task.assignee)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        {task.dueDate && (
          <div className={`flex items-center space-x-1 text-xs ${
            isOverdue ? "text-error" : "text-gray-500"
          }`}>
            <ApperIcon name="Calendar" className="h-3 w-3" />
            <span>
              {isOverdue ? "Overdue: " : "Due: "}
              {format(new Date(task.dueDate), "MMM d")}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            {task.commentCount > 0 && (
              <div className="flex items-center space-x-1">
                <ApperIcon name="MessageCircle" className="h-3 w-3" />
                <span>{task.commentCount}</span>
              </div>
            )}
            {task.attachmentCount > 0 && (
              <div className="flex items-center space-x-1">
                <ApperIcon name="Paperclip" className="h-3 w-3" />
                <span>{task.attachmentCount}</span>
              </div>
            )}
          </div>
          <span>#{task.Id}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;