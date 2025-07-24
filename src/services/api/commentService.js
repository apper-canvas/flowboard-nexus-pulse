import commentsData from "@/services/mockData/comments.json";

let comments = [...commentsData];

export const commentService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...comments];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 150));
    const comment = comments.find(c => c.Id === parseInt(id));
    if (!comment) {
      throw new Error("Comment not found");
    }
    return { ...comment };
  },

  async getByTaskId(taskId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return comments.filter(c => c.taskId === parseInt(taskId)).map(c => ({ ...c }));
  },

  async create(commentData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newComment = {
      Id: Math.max(...comments.map(c => c.Id), 0) + 1,
      ...commentData,
      timestamp: new Date().toISOString()
    };
    comments.push(newComment);
    return { ...newComment };
  },

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = comments.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Comment not found");
    }
    comments[index] = { ...comments[index], ...updateData };
    return { ...comments[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = comments.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Comment not found");
    }
    comments.splice(index, 1);
    return true;
  }
};