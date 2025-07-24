import { useState, useEffect } from "react";
import { taskService } from "@/services/api/taskService";

export const useTasks = (projectId = null) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let tasksData;
      if (projectId) {
        tasksData = await taskService.getByProjectId(projectId);
      } else {
        tasksData = await taskService.getAll();
      }
      
      setTasks(tasksData);
    } catch (err) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  const createTask = async (taskData) => {
    try {
      const newTask = await taskService.create({
        ...taskData,
        projectId: projectId ? parseInt(projectId) : taskData.projectId
      });
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      throw new Error(err.message || "Failed to create task");
    }
  };

  const updateTask = async (id, updateData) => {
    try {
      const updatedTask = await taskService.update(id, updateData);
      setTasks(prev => prev.map(t => t.Id === id ? updatedTask : t));
      return updatedTask;
    } catch (err) {
      throw new Error(err.message || "Failed to update task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.delete(id);
      setTasks(prev => prev.filter(t => t.Id !== id));
    } catch (err) {
      throw new Error(err.message || "Failed to delete task");
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      const updatedTask = await taskService.updateStatus(id, status);
      setTasks(prev => prev.map(t => t.Id === id ? updatedTask : t));
      return updatedTask;
    } catch (err) {
      throw new Error(err.message || "Failed to update task status");
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    refetch: loadTasks
  };
};