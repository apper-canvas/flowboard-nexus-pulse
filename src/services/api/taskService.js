export const taskService = {
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
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "progress_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "comment_count_c" } },
          { field: { Name: "attachment_count_c" } },
          { field: { Name: "project_id_c" } }
        ]
      };

      const response = await apperClient.fetchRecords('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name,
        description: task.description_c,
        assignee: task.assignee_c,
        status: task.status_c,
        priority: task.priority_c,
        dueDate: task.due_date_c,
        progress: task.progress_c || 0,
        createdAt: task.created_at_c,
        commentCount: task.comment_count_c || 0,
        attachmentCount: task.attachment_count_c || 0,
        projectId: task.project_id_c?.Id || task.project_id_c
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
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
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "progress_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "comment_count_c" } },
          { field: { Name: "attachment_count_c" } },
          { field: { Name: "project_id_c" } }
        ]
      };

      const response = await apperClient.getRecordById('task_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const task = response.data;
      return {
        Id: task.Id,
        title: task.title_c || task.Name,
        description: task.description_c,
        assignee: task.assignee_c,
        status: task.status_c,
        priority: task.priority_c,
        dueDate: task.due_date_c,
        progress: task.progress_c || 0,
        createdAt: task.created_at_c,
        commentCount: task.comment_count_c || 0,
        attachmentCount: task.attachment_count_c || 0,
        projectId: task.project_id_c?.Id || task.project_id_c
      };
    } catch (error) {
      console.error("Error fetching task:", error.message);
      throw error;
    }
  },

  async getByProjectId(projectId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "progress_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "comment_count_c" } },
          { field: { Name: "attachment_count_c" } },
          { field: { Name: "project_id_c" } }
        ],
        where: [
          {
            FieldName: "project_id_c",
            Operator: "EqualTo",
            Values: [parseInt(projectId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name,
        description: task.description_c,
        assignee: task.assignee_c,
        status: task.status_c,
        priority: task.priority_c,
        dueDate: task.due_date_c,
        progress: task.progress_c || 0,
        createdAt: task.created_at_c,
        commentCount: task.comment_count_c || 0,
        attachmentCount: task.attachment_count_c || 0,
        projectId: task.project_id_c?.Id || task.project_id_c
      }));
    } catch (error) {
      console.error("Error fetching tasks for project:", error.message);
      throw error;
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: taskData.title || 'New Task',
          title_c: taskData.title,
          description_c: taskData.description || '',
          assignee_c: taskData.assignee || '',
          status_c: taskData.status || 'todo',
          priority_c: taskData.priority || 'medium',
          due_date_c: taskData.dueDate || null,
          progress_c: taskData.progress || 0,
          created_at_c: new Date().toISOString(),
          comment_count_c: 0,
          attachment_count_c: 0,
          project_id_c: parseInt(taskData.projectId)
        }]
      };

      const response = await apperClient.createRecord('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} tasks: ${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create task");
        }
        
        if (successfulRecords.length > 0) {
          const task = successfulRecords[0].data;
          return {
            Id: task.Id,
            title: task.title_c || task.Name,
            description: task.description_c,
            assignee: task.assignee_c,
            status: task.status_c,
            priority: task.priority_c,
            dueDate: task.due_date_c,
            progress: task.progress_c || 0,
            createdAt: task.created_at_c,
            commentCount: task.comment_count_c || 0,
            attachmentCount: task.attachment_count_c || 0,
            projectId: task.project_id_c?.Id || task.project_id_c
          };
        }
      }
    } catch (error) {
      console.error("Error creating task:", error.message);
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
      if (updateData.title !== undefined) {
        updateRecord.Name = updateData.title;
        updateRecord.title_c = updateData.title;
      }
      if (updateData.description !== undefined) updateRecord.description_c = updateData.description;
      if (updateData.assignee !== undefined) updateRecord.assignee_c = updateData.assignee;
      if (updateData.status !== undefined) updateRecord.status_c = updateData.status;
      if (updateData.priority !== undefined) updateRecord.priority_c = updateData.priority;
      if (updateData.dueDate !== undefined) updateRecord.due_date_c = updateData.dueDate;
      if (updateData.progress !== undefined) updateRecord.progress_c = updateData.progress;

      const params = {
        records: [updateRecord]
      };

      const response = await apperClient.updateRecord('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} tasks: ${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to update task");
        }
        
        if (successfulRecords.length > 0) {
          const task = successfulRecords[0].data;
          return {
            Id: task.Id,
            title: task.title_c || task.Name,
            description: task.description_c,
            assignee: task.assignee_c,
            status: task.status_c,
            priority: task.priority_c,
            dueDate: task.due_date_c,
            progress: task.progress_c || 0,
            createdAt: task.created_at_c,
            commentCount: task.comment_count_c || 0,
            attachmentCount: task.attachment_count_c || 0,
            projectId: task.project_id_c?.Id || task.project_id_c
          };
        }
      }
    } catch (error) {
      console.error("Error updating task:", error.message);
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

      const response = await apperClient.deleteRecord('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      console.error("Error deleting task:", error.message);
      throw error;
    }
  },

  async updateStatus(id, status) {
    return this.update(id, { status });
  },

  async getTaskCounts(projectId) {
    try {
      const tasks = await this.getByProjectId(projectId);
      return {
        total: tasks.length,
        todo: tasks.filter(t => t.status === "todo").length,
        inProgress: tasks.filter(t => t.status === "inprogress").length,
        completed: tasks.filter(t => t.status === "done").length
      };
    } catch (error) {
      console.error("Error getting task counts:", error.message);
      return {
        total: 0,
        todo: 0,
        inProgress: 0,
completed: 0
      };
    }
  }
};