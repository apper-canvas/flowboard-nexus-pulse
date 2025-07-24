import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardStats from "@/components/organisms/DashboardStats";
import RecentActivity from "@/components/organisms/RecentActivity";
import ProjectCard from "@/components/molecules/ProjectCard";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { useProjects } from "@/hooks/useProjects";
import { useActivities } from "@/hooks/useActivities";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ onNewProject }) => {
  const navigate = useNavigate();
  const { projects, loading: projectsLoading, error: projectsError, refetch } = useProjects();
  const { activities, loading: activitiesLoading } = useActivities(null, 8);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Calculate dashboard stats
const stats = {
    totalProjects: projects.length,
    activeTasks: projects.reduce((sum, p) => sum + (p.taskCounts?.inProgress || 0) + (p.taskCounts?.todo || 0), 0),
    completedTasks: projects.reduce((sum, p) => sum + (p.taskCounts?.completed || 0), 0),
    teamMembers: [...new Set(projects.flatMap(p => p.teamMembers || []))].length
  };

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleProjectClick = (project) => {
    navigate(`/project/${project.Id}`);
  };

  if (projectsLoading) {
    return <Loading type="dashboard" />;
  }

  if (projectsError) {
    return <Error message={projectsError} onRetry={refetch} />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your projects.
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={onNewProject}
            className="shadow-md hover:shadow-lg"
          >
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={stats} />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Projects Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
            
            <div className="flex items-center space-x-3">
              <SearchBar
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <Empty
              type="projects"
              onAction={onNewProject}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.slice(0, 6).map((project, index) => (
                <motion.div
                  key={project.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProjectCard
                    project={project}
                    onClick={() => handleProjectClick(project)}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {filteredProjects.length > 6 && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => navigate("/projects")}
              >
                View All Projects
                <ApperIcon name="ArrowRight" className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="space-y-6">
          <RecentActivity activities={activities} />
          
          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6 border border-primary/10">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={onNewProject}
              >
                <ApperIcon name="FolderPlus" className="h-4 w-4 mr-3" />
                Create New Project
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate("/my-tasks")}
              >
                <ApperIcon name="CheckSquare" className="h-4 w-4 mr-3" />
                View My Tasks
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate("/team")}
              >
                <ApperIcon name="Users" className="h-4 w-4 mr-3" />
                Manage Team
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;