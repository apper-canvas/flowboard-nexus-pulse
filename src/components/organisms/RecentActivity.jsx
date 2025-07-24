import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import { Avatar, AvatarFallback } from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format, formatDistanceToNow } from "date-fns";

const RecentActivity = ({ activities = [] }) => {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "task_created":
        return "Plus";
      case "task_completed":
        return "CheckCircle";
      case "task_updated":
        return "Edit3";
      case "project_created":
        return "FolderPlus";
      case "comment_added":
        return "MessageCircle";
      default:
        return "Activity";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "task_created":
        return "text-blue-600 bg-blue-50";
      case "task_completed":
        return "text-emerald-600 bg-emerald-50";
      case "task_updated":
        return "text-orange-600 bg-orange-50";
      case "project_created":
        return "text-purple-600 bg-purple-50";
      case "comment_added":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

const formatActivityText = (activity) => {
    switch (activity.type) {
      case "task_created":
        return `created task "${activity.taskTitle}"`;
      case "task_completed":
        return `completed task "${activity.taskTitle}"`;
      case "task_updated":
        return `updated task "${activity.taskTitle}"`;
      case "project_created":
        return `created project "${activity.projectName}"`;
      case "comment_added":
        return `commented on "${activity.taskTitle}"`;
      default:
        return activity.description || "performed an action";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ApperIcon name="Activity" className="h-5 w-5 text-primary" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {activities.length === 0 ? (
            <div className="p-6 text-center">
              <ApperIcon name="Activity" className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No recent activity</p>
              <p className="text-sm text-gray-400">Activity will appear here as team members work on projects</p>
            </div>
          ) : (
            <div className="space-y-1">
              {activities.map((activity) => (
                <div
                  key={activity.Id}
                  className="flex items-start space-x-3 p-4 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                    <ApperIcon 
                      name={getActivityIcon(activity.type)} 
                      className="h-4 w-4" 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {getInitials(activity.user)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900 text-sm">
                        {activity.user}
                      </span>
                      <span className="text-sm text-gray-600">
                        {formatActivityText(activity)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </p>
                      {activity.projectName && (
                        <Badge variant="secondary" className="text-xs">
                          {activity.projectName}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;