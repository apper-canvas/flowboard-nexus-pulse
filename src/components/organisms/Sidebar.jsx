import React, { useState, useContext } from "react";
import { NavLink, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Projects from "@/components/pages/Projects";
import Button from "@/components/atoms/Button";

const Sidebar = ({ projects = [], onNewProject }) => {
  const { projectId } = useParams();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = [
    { name: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
    { name: "My Tasks", path: "/my-tasks", icon: "CheckSquare" },
    { name: "Calendar", path: "/calendar", icon: "Calendar" },
    { name: "Team", path: "/team", icon: "Users" },
    { name: "Settings", path: "/settings", icon: "Settings" }
  ];

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-gradient-to-b from-white to-gray-50/80 backdrop-blur-sm border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Trello" className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            FlowBoard
          </h1>
        </div>
        
        {/* Mobile close button */}
        <button 
          className="lg:hidden p-1 hover:bg-gray-100 rounded-md"
          onClick={() => setIsMobileOpen(false)}
        >
          <ApperIcon name="X" className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )
              }
              onClick={() => setIsMobileOpen(false)}
            >
              <ApperIcon name={item.icon} className="h-4 w-4" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Projects Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Projects
            </h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={onNewProject}
              className="h-6 w-6 p-0 rounded-full hover:bg-primary hover:text-white"
            >
              <ApperIcon name="Plus" className="h-3 w-3" />
            </Button>
          </div>

          <div className="space-y-1 max-h-64 overflow-y-auto">
            {projects.map((project) => (
              <NavLink
                key={project.Id}
                to={`/project/${project.Id}`}
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 group",
                    isActive || projectId === project.Id.toString()
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )
                }
                onClick={() => setIsMobileOpen(false)}
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <div className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    project.status === "active" && "bg-success",
                    project.status === "completed" && "bg-primary",
                    project.status === "on-hold" && "bg-warning",
                    !project.status && "bg-gray-400"
                  )} />
                  <span className="truncate font-medium">{project.name}</span>
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-gray-400">{project.taskCounts?.total || 0}</span>
                </div>
              </NavLink>
            ))}
            
            {projects.length === 0 && (
              <div className="px-3 py-4 text-center">
                <ApperIcon name="FolderOpen" className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-2">No projects yet</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onNewProject}
                  className="text-xs"
                >
                  Create Project
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

{/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between space-x-2 p-2 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">TM</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Team Member</p>
              <p className="text-xs text-gray-500 truncate">Project Manager</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              // TODO: Implement proper logout functionality
              console.log('Logout clicked');
            }}
            className="h-8 w-8 p-0 rounded-full hover:bg-gray-200"
          >
            <ApperIcon name="LogOut" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
        onClick={() => setIsMobileOpen(true)}
      >
        <ApperIcon name="Menu" className="h-5 w-5 text-gray-700" />
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 h-screen fixed left-0 top-0 z-40">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileOpen(false)}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 w-64 z-50"
          >
            <SidebarContent />
          </motion.div>
        </>
      )}
    </>
  );
};

export default Sidebar;