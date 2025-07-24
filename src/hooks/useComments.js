import { useState, useEffect } from "react";
import { commentService } from "@/services/api/commentService";

export const useComments = (taskId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadComments = async () => {
    if (!taskId) {
      setComments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const commentsData = await commentService.getByTaskId(taskId);
      setComments(commentsData);
    } catch (err) {
      setError(err.message || "Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [taskId]);

  const addComment = async (commentData) => {
    try {
      const newComment = await commentService.create({
        ...commentData,
        taskId: parseInt(taskId)
      });
      setComments(prev => [...prev, newComment]);
      return newComment;
    } catch (err) {
      throw new Error(err.message || "Failed to add comment");
    }
  };

  const updateComment = async (id, updateData) => {
    try {
      const updatedComment = await commentService.update(id, updateData);
      setComments(prev => prev.map(c => c.Id === id ? updatedComment : c));
      return updatedComment;
    } catch (err) {
      throw new Error(err.message || "Failed to update comment");
    }
  };

  const deleteComment = async (id) => {
    try {
      await commentService.delete(id);
      setComments(prev => prev.filter(c => c.Id !== id));
    } catch (err) {
      throw new Error(err.message || "Failed to delete comment");
    }
  };

  return {
    comments,
    loading,
    error,
    addComment,
    updateComment,
    deleteComment,
    refetch: loadComments
  };
};