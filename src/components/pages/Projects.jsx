import React, { useState } from "react";
import { motion } from "framer-motion";
import ProjectCard from "@/components/molecules/ProjectCard";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { useProjects } from "@/hooks/useProjects";
import { useNavigate } from "react-router-dom";

const Projects = ({ onNewProject }) => {
  const navigate = useNavigate();
  const { projects, loading, error, refetch } = useProjects();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "progress":
          return (b.progress || 0) - (a.progress || 0);
        case "recent":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const handleProjectClick = (project) => {
    navigate(`/project/${project.Id}`);
  };

  if (loading) {
    return <Loading type="projects" />;
  }

  if (error) {
    return <Error message={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Projects
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and organize all your projects in one place
          </p>
        </div>
        
        <Button
          onClick={onNewProject}
          className="shadow-md hover:shadow-lg"
        >
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Filter" className="h-4 w-4 text-gray-500" />
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

          <div className="flex items-center space-x-2">
            <ApperIcon name="ArrowUpDown" className="h-4 w-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="recent">Most Recent</option>
              <option value="name">Name</option>
              <option value="progress">Progress</option>
            </select>
          </div>
        </div>

        <SearchBar
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-80"
        />
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Empty
          type={searchTerm || statusFilter !== "all" ? "search" : "projects"}
          onAction={searchTerm || statusFilter !== "all" ? 
            () => { setSearchTerm(""); setStatusFilter("all"); } : 
            onNewProject
          }
          actionLabel={searchTerm || statusFilter !== "all" ? "Clear Filters" : "Create Project"}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProjectCard
                  project={project}
                  onClick={() => handleProjectClick(project)}
                />
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="flex items-center justify-center pt-4">
            <p className="text-sm text-gray-600">
              Showing {filteredProjects.length} of {projects.length} projects
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Projects;