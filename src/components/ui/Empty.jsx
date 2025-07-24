import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const Empty = ({ 
  title = "No items found",
  message = "Get started by creating your first item",
  actionLabel = "Create New",
  onAction,
  icon = "Package",
  type = "default"
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case "projects":
        return {
          icon: "FolderOpen",
          title: "No projects yet",
          message: "Create your first project to start organizing tasks and collaborating with your team",
          actionLabel: "Create Project",
          color: "from-blue-500 to-purple-600"
        };
      case "tasks":
        return {
          icon: "CheckSquare", 
          title: "No tasks found",
          message: "Add your first task to get started with project management",
          actionLabel: "Add Task",
          color: "from-emerald-500 to-blue-500"
        };
      case "comments":
        return {
          icon: "MessageCircle",
          title: "No comments yet",
          message: "Start a conversation by adding the first comment",
          actionLabel: "Add Comment",
          color: "from-purple-500 to-pink-500"
        };
      case "team":
        return {
          icon: "Users",
          title: "No team members",
          message: "Invite team members to start collaborating on projects",
          actionLabel: "Invite Members",
          color: "from-orange-500 to-red-500"
        };
      case "search":
        return {
          icon: "Search",
          title: "No results found",
          message: "Try adjusting your search terms or filters",
          actionLabel: "Clear Search",
          color: "from-gray-500 to-gray-600"
        };
      default:
        return {
          icon: icon,
          title: title,
          message: message,
          actionLabel: actionLabel,
          color: "from-primary to-secondary"
        };
    }
  };

  const emptyContent = getEmptyContent();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
    >
      <div className="relative mb-8">
        <div className={`absolute inset-0 bg-gradient-to-r ${emptyContent.color} rounded-full blur-xl opacity-20`} />
        <div className="relative bg-white p-8 rounded-full shadow-lg border border-gray-100">
          <ApperIcon 
            name={emptyContent.icon} 
            className={`h-20 w-20 bg-gradient-to-r ${emptyContent.color} bg-clip-text text-transparent`}
          />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {emptyContent.title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {emptyContent.message}
      </p>

      {onAction && (
        <Button 
          onClick={onAction}
          className="shadow-md hover:shadow-lg px-6 py-3"
        >
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          {emptyContent.actionLabel}
        </Button>
      )}

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 right-8 w-16 h-16 bg-gradient-to-br ${emptyContent.color} rounded-full opacity-10`} />
        <div className={`absolute bottom-20 left-8 w-20 h-20 bg-gradient-to-br ${emptyContent.color} rounded-full opacity-10`} />
        <div className={`absolute top-32 left-16 w-4 h-4 bg-gradient-to-br ${emptyContent.color} rounded-full opacity-20`} />
        <div className={`absolute bottom-32 right-16 w-6 h-6 bg-gradient-to-br ${emptyContent.color} rounded-full opacity-20`} />
      </div>
    </motion.div>
  );
};

export default Empty;