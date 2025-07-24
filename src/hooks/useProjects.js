import { useState, useEffect } from "react";
import { projectService } from "@/services/api/projectService";
import { taskService } from "@/services/api/taskService";

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const projectsData = await projectService.getAll();
      
      // Enrich projects with task counts
      const enrichedProjects = await Promise.all(
        projectsData.map(async (project) => {
          try {
            const taskCounts = await taskService.getTaskCounts(project.Id);
            const progress = taskCounts.total > 0 
              ? Math.round((taskCounts.completed / taskCounts.total) * 100)
              : 0;
            
            return {
              ...project,
              taskCounts,
              progress
            };
          } catch (err) {
            return project;
          }
        })
      );

      setProjects(enrichedProjects);
    } catch (err) {
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const createProject = async (projectData) => {
    try {
      const newProject = await projectService.create(projectData);
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    } catch (err) {
      throw new Error(err.message || "Failed to create project");
    }
  };

  const updateProject = async (id, updateData) => {
    try {
      const updatedProject = await projectService.update(id, updateData);
      setProjects(prev => prev.map(p => p.Id === id ? updatedProject : p));
      return updatedProject;
    } catch (err) {
      throw new Error(err.message || "Failed to update project");
    }
  };

  const deleteProject = async (id) => {
    try {
      await projectService.delete(id);
      setProjects(prev => prev.filter(p => p.Id !== id));
    } catch (err) {
      throw new Error(err.message || "Failed to delete project");
    }
  };

  const refreshProject = async (projectId) => {
    try {
      const project = await projectService.getById(projectId);
      const taskCounts = await taskService.getTaskCounts(projectId);
      const progress = taskCounts.total > 0 
        ? Math.round((taskCounts.completed / taskCounts.total) * 100)
        : 0;

      const enrichedProject = {
        ...project,
        taskCounts,
        progress
      };

      setProjects(prev => prev.map(p => p.Id === projectId ? enrichedProject : p));
      return enrichedProject;
    } catch (err) {
      throw new Error(err.message || "Failed to refresh project");
    }
  };

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refreshProject,
    refetch: loadProjects
  };
};