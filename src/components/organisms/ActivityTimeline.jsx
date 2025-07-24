import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import { Avatar, AvatarFallback } from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import { format, formatDistanceToNow, isToday, isYesterday, startOfDay, isSameDay } from "date-fns";

const ActivityTimeline = ({ activities = [], loading = false, onActivityClick }) => {
  const [filter, setFilter] = useState("all");

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??";
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "task_created":
        return "Plus";
      case "task_completed":
        return "CheckCircle";
      case "task_updated":
        return "Edit3";
      case "task_assigned":
        return "UserPlus";
      case "project_created":
        return "FolderPlus";
      case "project_updated":
        return "Settings";
      case "comment_added":
        return "MessageCircle";
      case "file_uploaded":
        return "Upload";
      default:
        return "Activity";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "task_created":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "task_completed":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "task_updated":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "task_assigned":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "project_created":
        return "text-indigo-600 bg-indigo-50 border-indigo-200";
      case "project_updated":
        return "text-gray-600 bg-gray-50 border-gray-200";
      case "comment_added":
        return "text-teal-600 bg-teal-50 border-teal-200";
      case "file_uploaded":
        return "text-pink-600 bg-pink-50 border-pink-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
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
      case "task_assigned":
        return `was assigned to task "${activity.taskTitle}"`;
      case "project_created":
        return `created project "${activity.projectName}"`;
      case "project_updated":
        return `updated project "${activity.projectName}"`;
      case "comment_added":
        return `commented on "${activity.taskTitle}"`;
      case "file_uploaded":
        return `uploaded a file to "${activity.taskTitle}"`;
      default:
        return activity.description || "performed an action";
    }
  };

  const getDateLabel = (date) => {
    const activityDate = new Date(date);
    if (isToday(activityDate)) {
      return "Today";
    } else if (isYesterday(activityDate)) {
      return "Yesterday";
    } else {
      return format(activityDate, "MMMM d, yyyy");
    }
  };

  // Filter activities based on selected filter
  const filteredActivities = useMemo(() => {
    if (filter === "all") return activities;
    
    const filterMap = {
      tasks: ["task_created", "task_completed", "task_updated", "task_assigned"],
      comments: ["comment_added"],
      projects: ["project_created", "project_updated"],
      files: ["file_uploaded"]
    };
    
    return activities.filter(activity => 
      filterMap[filter]?.includes(activity.type)
    );
  }, [activities, filter]);

  // Group activities by date
  const groupedActivities = useMemo(() => {
    const groups = {};
    
    filteredActivities.forEach(activity => {
      const date = startOfDay(new Date(activity.timestamp));
      const dateKey = date.toISOString();
      
      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: date,
          activities: []
        };
      }
      
      groups[dateKey].activities.push(activity);
    });
    
    // Sort groups by date (newest first)
    return Object.values(groups).sort((a, b) => b.date - a.date);
  }, [filteredActivities]);

  // Count activities by type for filter badges
  const activityCounts = useMemo(() => {
    const counts = {
      all: activities.length,
      tasks: 0,
      comments: 0,
      projects: 0,
      files: 0
    };
    
    activities.forEach(activity => {
      if (["task_created", "task_completed", "task_updated", "task_assigned"].includes(activity.type)) {
        counts.tasks++;
      } else if (activity.type === "comment_added") {
        counts.comments++;
      } else if (["project_created", "project_updated"].includes(activity.type)) {
        counts.projects++;
      } else if (activity.type === "file_uploaded") {
        counts.files++;
      }
    });
    
    return counts;
  }, [activities]);

  const handleActivityClick = (activity) => {
    if (onActivityClick) {
      onActivityClick(activity);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Filter Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <ApperIcon name="Clock" className="h-5 w-5 mr-2 text-primary" />
            Project Activity Timeline
          </h2>
          <div className="text-sm text-gray-500">
            {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'}
          </div>
        </div>
        
        {/* Activity Type Filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "All", icon: "Activity" },
            { key: "tasks", label: "Tasks", icon: "CheckSquare" },
            { key: "comments", label: "Comments", icon: "MessageCircle" },
            { key: "projects", label: "Projects", icon: "Folder" },
            { key: "files", label: "Files", icon: "Upload" }
          ].map(({ key, label, icon }) => (
            <Button
              key={key}
              variant={filter === key ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(key)}
              className="flex items-center space-x-1"
            >
              <ApperIcon name={icon} className="h-4 w-4" />
              <span>{label}</span>
              {activityCounts[key] > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {activityCounts[key]}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredActivities.length === 0 ? (
          <Empty
            icon="Clock"
            title="No activities found"
            message={
              filter === "all" 
                ? "No activities have been recorded for this project yet."
                : `No ${filter} activities found. Try selecting a different filter.`
            }
          />
        ) : (
          <div className="space-y-8">
            {groupedActivities.map(({ date, activities: dayActivities }) => (
              <div key={date.toISOString()} className="relative">
                {/* Date Header */}
                <div className="flex items-center mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 bg-white px-3 py-1 rounded-full border border-gray-200">
                    {getDateLabel(date)}
                  </h3>
                  <div className="flex-1 h-px bg-gray-200 ml-4"></div>
                </div>

                {/* Activities for this date */}
                <div className="space-y-4 ml-4">
                  {dayActivities.map((activity, index) => (
                    <div
                      key={activity.Id}
                      className="relative flex items-start space-x-4 group"
                    >
                      {/* Timeline line */}
                      {index !== dayActivities.length - 1 && (
                        <div className="absolute left-6 top-12 w-px h-16 bg-gray-200"></div>
                      )}

                      {/* Activity Icon */}
                      <div className={`relative z-10 p-2 rounded-lg border ${getActivityColor(activity.type)}`}>
                        <ApperIcon 
                          name={getActivityIcon(activity.type)} 
                          className="h-4 w-4" 
                        />
                      </div>

                      {/* Activity Content */}
                      <div className="flex-1 min-w-0">
                        <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
                              onClick={() => handleActivityClick(activity)}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-2">
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
                                
                                <div className="flex items-center justify-between">
                                  <p className="text-xs text-gray-500">
                                    {format(new Date(activity.timestamp), "h:mm a")} • {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                  </p>
                                  
                                  {activity.projectName && (
                                    <Badge variant="outline" className="text-xs">
                                      {activity.projectName}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <ApperIcon 
                                name="ChevronRight" 
                                className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2" 
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;