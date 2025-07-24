import React from "react";
import { motion } from "framer-motion";

const Loading = ({ type = "dashboard" }) => {
  if (type === "kanban") {
    return (
      <div className="h-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-gray-200 rounded-lg w-32 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {[1, 2, 3].map((col) => (
            <div key={col} className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 bg-gray-200 rounded w-20 animate-pulse" />
                <div className="h-5 w-8 bg-gray-200 rounded-full animate-pulse" />
              </div>
              
              <div className="bg-white/50 p-4 rounded-xl min-h-[600px] space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-white p-4 rounded-lg shadow-sm space-y-3 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-12 bg-gray-200 rounded" />
                      <div className="h-6 w-6 bg-gray-200 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "projects") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-white p-6 rounded-lg shadow-card animate-pulse">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-5 w-16 bg-gray-200 rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-16" />
                  <div className="h-3 bg-gray-200 rounded w-8" />
                </div>
                <div className="h-2 bg-gray-200 rounded w-full" />
              </div>
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((avatar) => (
                    <div key={avatar} className="h-6 w-6 bg-gray-200 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white p-6 rounded-lg shadow-card animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-8 bg-gray-200 rounded w-16" />
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Content Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-card animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-40 mb-4" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-card animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="h-6 w-6 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;