import React from "react";
import Error from "@/components/ui/Error";
export const projectService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description_c" } },
          { field: { Name: "team_members_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "progress_c" } },
          { field: { Name: "task_counts_total_c" } },
          { field: { Name: "task_counts_todo_c" } },
          { field: { Name: "task_counts_in_progress_c" } },
          { field: { Name: "task_counts_completed_c" } }
        ]
      };

      const response = await apperClient.fetchRecords('project_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

return response.data.map(project => ({
        Id: project.Id,
        name: project.Name,
        description: project.description_c,
        teamMembers: project.team_members_c ? project.team_members_c.split(',') : [],
        status: project.status_c,
        createdAt: project.created_at_c,
        progress: project.progress_c || 0,
        taskCounts: {
          total: project.task_counts_total_c || 0,
          todo: project.task_counts_todo_c || 0,
          inProgress: project.task_counts_in_progress_c || 0,
          completed: project.task_counts_completed_c || 0
        }
      }));
    } catch (error) {
      console.error("Error fetching projects:", error.message);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description_c" } },
          { field: { Name: "team_members_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "progress_c" } },
          { field: { Name: "task_counts_total_c" } },
          { field: { Name: "task_counts_todo_c" } },
          { field: { Name: "task_counts_in_progress_c" } },
          { field: { Name: "task_counts_completed_c" } }
        ]
      };

      const response = await apperClient.getRecordById('project_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

const project = response.data;
      return {
        Id: project.Id,
        name: project.Name,
        description: project.description_c,
        teamMembers: project.team_members_c ? project.team_members_c.split(',') : [],
        status: project.status_c,
        createdAt: project.created_at_c,
        progress: project.progress_c || 0,
        taskCounts: {
          total: project.task_counts_total_c || 0,
          todo: project.task_counts_todo_c || 0,
          inProgress: project.task_counts_in_progress_c || 0,
          completed: project.task_counts_completed_c || 0
        }
      };
    } catch (error) {
      console.error("Error fetching project:", error.message);
      throw error;
    }
  },

  async create(projectData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

const params = {
        records: [{
          Name: projectData.name,
          description_c: projectData.description || '',
          team_members_c: Array.isArray(projectData.teamMembers) ? projectData.teamMembers.join(',') : '',
          status_c: projectData.status || 'active',
          created_at_c: new Date().toISOString(),
          progress_c: 0,
          task_counts_total_c: 0,
          task_counts_todo_c: 0,
          task_counts_in_progress_c: 0,
          task_counts_completed_c: 0
        }]
      };

      const response = await apperClient.createRecord('project_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} projects: ${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create project");
        }
        
if (successfulRecords.length > 0) {
          const project = successfulRecords[0].data;
          return {
            Id: project.Id,
            name: project.Name,
            description: project.description_c,
            teamMembers: project.team_members_c ? project.team_members_c.split(',') : [],
            status: project.status_c,
            createdAt: project.created_at_c,
            progress: project.progress_c || 0,
            taskCounts: {
              total: project.task_counts_total_c || 0,
              todo: project.task_counts_todo_c || 0,
              inProgress: project.task_counts_in_progress_c || 0,
              completed: project.task_counts_completed_c || 0
            }
          };
        }
      }
    } catch (error) {
      console.error("Error creating project:", error.message);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateRecord = {
        Id: parseInt(id)
      };

// Only include fields that are being updated
      if (updateData.name !== undefined) updateRecord.Name = updateData.name;
      if (updateData.description !== undefined) updateRecord.description_c = updateData.description;
      if (updateData.teamMembers !== undefined) {
        updateRecord.team_members_c = Array.isArray(updateData.teamMembers) ? updateData.teamMembers.join(',') : updateData.teamMembers;
      }
      if (updateData.status !== undefined) updateRecord.status_c = updateData.status;
      if (updateData.progress !== undefined) updateRecord.progress_c = updateData.progress;
      
const params = {
        records: [updateRecord]
      };

      const response = await apperClient.updateRecord('project_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} projects: ${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to update project");
        }
        
        if (successfulRecords.length > 0) {
const project = successfulRecords[0].data;
          return {
            Id: project.Id,
            name: project.Name,
            description: project.description_c,
            teamMembers: project.team_members_c ? project.team_members_c.split(',') : [],
            status: project.status_c,
            createdAt: project.created_at_c,
            progress: project.progress_c || 0,
            taskCounts: {
              total: project.task_counts_total_c || 0,
              todo: project.task_counts_todo_c || 0,
              inProgress: project.task_counts_in_progress_c || 0,
              completed: project.task_counts_completed_c || 0
            }
          };
        }
      }
    } catch (error) {
      console.error("Error updating project:", error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('project_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      console.error("Error deleting project:", error.message);
      throw error;
    }
  },

  async updateProgress(id, progress) {
    return this.update(id, { progress });
  },

  async updateTaskCounts(id, taskCounts) {
    const updateData = {};
    if (taskCounts.total !== undefined) updateData.task_counts_total_c = taskCounts.total;
    if (taskCounts.todo !== undefined) updateData.task_counts_todo_c = taskCounts.todo;
    if (taskCounts.inProgress !== undefined) updateData.task_counts_in_progress_c = taskCounts.inProgress;
    if (taskCounts.completed !== undefined) updateData.task_counts_completed_c = taskCounts.completed;
    
    return this.update(id, updateData);
  }
};