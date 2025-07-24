import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  title = "Oops!",
  type = "general" 
}) => {
  const getErrorContent = () => {
    switch (type) {
      case "network":
        return {
          icon: "WifiOff",
          title: "Connection Error",
          message: "Unable to connect to the server. Please check your internet connection.",
          color: "text-orange-500"
        };
      case "notfound":
        return {
          icon: "Search",
          title: "Not Found",
          message: "The resource you're looking for doesn't exist.",
          color: "text-blue-500"
        };
      case "permission":
        return {
          icon: "Shield",
          title: "Access Denied",
          message: "You don't have permission to access this resource.",
          color: "text-red-500"
        };
      default:
        return {
          icon: "AlertTriangle",
          title: title,
          message: message,
          color: "text-red-500"
        };
    }
  };

  const errorContent = getErrorContent();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-orange-100 rounded-full blur-xl opacity-60" />
        <div className="relative bg-white p-6 rounded-full shadow-lg">
          <ApperIcon 
            name={errorContent.icon} 
            className={`h-16 w-16 ${errorContent.color}`}
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        {errorContent.title}
      </h2>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {errorContent.message}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        {onRetry && (
          <Button 
            onClick={onRetry}
            className="shadow-md hover:shadow-lg"
          >
            <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
        
        <Button 
          variant="secondary"
          onClick={() => window.history.back()}
        >
          <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-full opacity-20" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full opacity-20" />
      </div>
    </motion.div>
  );
};

export default Error;