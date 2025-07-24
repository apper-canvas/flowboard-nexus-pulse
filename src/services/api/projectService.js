import projectsData from "@/services/mockData/projects.json";

let projects = [...projectsData];

export const projectService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...projects];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const project = projects.find(p => p.Id === parseInt(id));
    if (!project) {
      throw new Error("Project not found");
    }
    return { ...project };
  },

  async create(projectData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newProject = {
      Id: Math.max(...projects.map(p => p.Id), 0) + 1,
      ...projectData,
      createdAt: new Date().toISOString(),
      progress: 0,
      taskCounts: {
        total: 0,
        completed: 0,
        inProgress: 0,
        todo: 0
      }
    };
    projects.push(newProject);
    return { ...newProject };
  },

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = projects.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Project not found");
    }
    projects[index] = { ...projects[index], ...updateData };
    return { ...projects[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = projects.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Project not found");
    }
    projects.splice(index, 1);
    return true;
  },

  async updateProgress(id, progress) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = projects.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Project not found");
    }
    projects[index].progress = progress;
    return { ...projects[index] };
  },

  async updateTaskCounts(id, taskCounts) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = projects.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Project not found");
    }
    projects[index].taskCounts = taskCounts;
    return { ...projects[index] };
  }
};