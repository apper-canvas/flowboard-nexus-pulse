import activitiesData from "@/services/mockData/activities.json";

let activities = [...activitiesData];

export const activityService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 250));
    return [...activities].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  async getRecent(limit = 10) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...activities]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  },

  async getByProjectId(projectId, limit = 20) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return activities
      .filter(a => a.projectId === parseInt(projectId))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit)
      .map(a => ({ ...a }));
  },

  async create(activityData) {
    await new Promise(resolve => setTimeout(resolve, 150));
    const newActivity = {
      Id: Math.max(...activities.map(a => a.Id), 0) + 1,
      ...activityData,
      timestamp: new Date().toISOString()
    };
    activities.unshift(newActivity);
    return { ...newActivity };
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