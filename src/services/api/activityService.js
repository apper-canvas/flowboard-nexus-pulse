export const activityService = {
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
          { field: { Name: "type_c" } },
          { field: { Name: "user_c" } },
          { field: { Name: "task_title_c" } },
          { field: { Name: "project_name_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "task_id_c" } },
          { field: { Name: "project_id_c" } }
        ],
        orderBy: [
          {
            fieldName: "timestamp_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('app_Activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data.map(activity => ({
        Id: activity.Id,
        type: activity.type_c,
        user: activity.user_c,
        taskTitle: activity.task_title_c,
        projectName: activity.project_name_c,
        timestamp: activity.timestamp_c,
        taskId: activity.task_id_c?.Id || activity.task_id_c,
        projectId: activity.project_id_c?.Id || activity.project_id_c
      }));
    } catch (error) {
      console.error("Error fetching activities:", error.message);
      throw error;
    }
  },

  async getRecent(limit = 10) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type_c" } },
          { field: { Name: "user_c" } },
          { field: { Name: "task_title_c" } },
          { field: { Name: "project_name_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "task_id_c" } },
          { field: { Name: "project_id_c" } }
        ],
        orderBy: [
          {
            fieldName: "timestamp_c",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('app_Activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data.map(activity => ({
        Id: activity.Id,
        type: activity.type_c,
        user: activity.user_c,
        taskTitle: activity.task_title_c,
        projectName: activity.project_name_c,
        timestamp: activity.timestamp_c,
        taskId: activity.task_id_c?.Id || activity.task_id_c,
        projectId: activity.project_id_c?.Id || activity.project_id_c
      }));
    } catch (error) {
      console.error("Error fetching recent activities:", error.message);
      throw error;
    }
  },

  async getByProjectId(projectId, limit = 20) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type_c" } },
          { field: { Name: "user_c" } },
          { field: { Name: "task_title_c" } },
          { field: { Name: "project_name_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "task_id_c" } },
          { field: { Name: "project_id_c" } }
        ],
        where: [
          {
            FieldName: "project_id_c",
            Operator: "EqualTo",
            Values: [parseInt(projectId)]
          }
        ],
        orderBy: [
          {
            fieldName: "timestamp_c",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('app_Activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data.map(activity => ({
        Id: activity.Id,
        type: activity.type_c,
        user: activity.user_c,
        taskTitle: activity.task_title_c,
        projectName: activity.project_name_c,
        timestamp: activity.timestamp_c,
        taskId: activity.task_id_c?.Id || activity.task_id_c,
        projectId: activity.project_id_c?.Id || activity.project_id_c
      }));
    } catch (error) {
      console.error("Error fetching activities for project:", error.message);
      throw error;
    }
  },

  async create(activityData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: `${activityData.type} by ${activityData.user}`,
          type_c: activityData.type,
          user_c: activityData.user,
          task_title_c: activityData.taskTitle || '',
          project_name_c: activityData.projectName || '',
          timestamp_c: new Date().toISOString(),
          task_id_c: activityData.taskId ? parseInt(activityData.taskId) : null,
          project_id_c: activityData.projectId ? parseInt(activityData.projectId) : null
        }]
      };

      const response = await apperClient.createRecord('app_Activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} activities: ${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create activity");
        }
        
        if (successfulRecords.length > 0) {
          const activity = successfulRecords[0].data;
          return {
            Id: activity.Id,
            type: activity.type_c,
            user: activity.user_c,
            taskTitle: activity.task_title_c,
            projectName: activity.project_name_c,
            timestamp: activity.timestamp_c,
            taskId: activity.task_id_c?.Id || activity.task_id_c,
            projectId: activity.project_id_c?.Id || activity.project_id_c
          };
        }
      }
    } catch (error) {
      console.error("Error creating activity:", error.message);
      throw error;
    }
  },

  async logTaskActivity(type, taskData, user = "Current User") {
    const activity = {
      type: type,
      user: user,
      taskId: taskData.Id,
      taskTitle: taskData.title,
      projectId: taskData.projectId,
      projectName: taskData.projectName || "Unknown Project"
    };
    return this.create(activity);
  },

  async logProjectActivity(type, projectData, user = "Current User") {
    const activity = {
      type: type,
      user: user,
      projectId: projectData.Id,
      projectName: projectData.name
    };
    return this.create(activity);
  }
};