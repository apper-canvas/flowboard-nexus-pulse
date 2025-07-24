export const commentService = {
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
          { field: { Name: "author_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "task_id_c" } }
        ]
      };

      const response = await apperClient.fetchRecords('app_Comment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data.map(comment => ({
        Id: comment.Id,
        author: comment.author_c,
        content: comment.content_c,
        timestamp: comment.timestamp_c,
        taskId: comment.task_id_c?.Id || comment.task_id_c
      }));
    } catch (error) {
      console.error("Error fetching comments:", error.message);
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
          { field: { Name: "author_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "task_id_c" } }
        ]
      };

      const response = await apperClient.getRecordById('app_Comment_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const comment = response.data;
      return {
        Id: comment.Id,
        author: comment.author_c,
        content: comment.content_c,
        timestamp: comment.timestamp_c,
        taskId: comment.task_id_c?.Id || comment.task_id_c
      };
    } catch (error) {
      console.error("Error fetching comment:", error.message);
      throw error;
    }
  },

  async getByTaskId(taskId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "author_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "task_id_c" } }
        ],
        where: [
          {
            FieldName: "task_id_c",
            Operator: "EqualTo",
            Values: [parseInt(taskId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('app_Comment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data.map(comment => ({
        Id: comment.Id,
        author: comment.author_c,
        content: comment.content_c,
        timestamp: comment.timestamp_c,
        taskId: comment.task_id_c?.Id || comment.task_id_c
      }));
    } catch (error) {
      console.error("Error fetching comments for task:", error.message);
      throw error;
    }
  },

  async create(commentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: `Comment by ${commentData.author}`,
          author_c: commentData.author,
          content_c: commentData.content,
          timestamp_c: new Date().toISOString(),
          task_id_c: parseInt(commentData.taskId)
        }]
      };

      const response = await apperClient.createRecord('app_Comment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} comments: ${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create comment");
        }
        
        if (successfulRecords.length > 0) {
          const comment = successfulRecords[0].data;
          return {
            Id: comment.Id,
            author: comment.author_c,
            content: comment.content_c,
            timestamp: comment.timestamp_c,
            taskId: comment.task_id_c?.Id || comment.task_id_c
          };
        }
      }
    } catch (error) {
      console.error("Error creating comment:", error.message);
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
      if (updateData.content !== undefined) updateRecord.content_c = updateData.content;
      if (updateData.author !== undefined) updateRecord.author_c = updateData.author;

      const params = {
        records: [updateRecord]
      };

      const response = await apperClient.updateRecord('app_Comment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} comments: ${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to update comment");
        }
        
        if (successfulRecords.length > 0) {
          const comment = successfulRecords[0].data;
          return {
            Id: comment.Id,
            author: comment.author_c,
            content: comment.content_c,
            timestamp: comment.timestamp_c,
            taskId: comment.task_id_c?.Id || comment.task_id_c
          };
        }
      }
    } catch (error) {
      console.error("Error updating comment:", error.message);
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

      const response = await apperClient.deleteRecord('app_Comment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      console.error("Error deleting comment:", error.message);
      throw error;
    }
  }
};