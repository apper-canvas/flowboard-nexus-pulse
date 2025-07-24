import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];

export const taskService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...tasks];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const task = tasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  },

  async getByProjectId(projectId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return tasks.filter(t => t.projectId === parseInt(projectId)).map(t => ({ ...t }));
  },

  async create(taskData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newTask = {
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      ...taskData,
      createdAt: new Date().toISOString(),
      commentCount: 0,
      attachmentCount: 0
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    tasks[index] = { ...tasks[index], ...updateData };
    return { ...tasks[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    tasks.splice(index, 1);
    return true;
  },

  async updateStatus(id, status) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    tasks[index].status = status;
    return { ...tasks[index] };
  },

  async getTaskCounts(projectId) {
    await new Promise(resolve => setTimeout(resolve, 150));
    const projectTasks = tasks.filter(t => t.projectId === parseInt(projectId));
    return {
      total: projectTasks.length,
      todo: projectTasks.filter(t => t.status === "todo").length,
      inProgress: projectTasks.filter(t => t.status === "inprogress").length,
      completed: projectTasks.filter(t => t.status === "done").length
    };
  }
};