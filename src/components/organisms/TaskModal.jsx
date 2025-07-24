import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Badge from "@/components/atoms/Badge";
import { Avatar, AvatarFallback } from "@/components/atoms/Avatar";
import Progress from "@/components/atoms/Progress";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { fileService } from "@/services/api/fileService";

const TaskModal = ({ 
  task, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  projectMembers = [],
  comments = [],
  onAddComment 
}) => {
const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignee: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
    progress: 0
  });
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // File upload states
  const [files, setFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        assignee: task.assignee || "",
        status: task.status || "todo",
        priority: task.priority || "medium",
        dueDate: task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "",
        progress: task.progress || 0
      });
      
      // Load files for existing task
      loadTaskFiles();
    } else {
      setFormData({
        title: "",
        description: "",
        assignee: "",
        status: "todo",
        priority: "medium",
        dueDate: "",
        progress: 0
      });
      setFiles([]);
    }
  }, [task]);

  const loadTaskFiles = async () => {
    if (!task?.Id) return;
    
    setLoadingFiles(true);
    try {
      const taskFiles = await fileService.getByTaskId(task.Id);
      setFiles(taskFiles);
    } catch (error) {
      console.error("Error loading task files:", error);
      toast.error("Failed to load attachments");
    } finally {
      setLoadingFiles(false);
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const taskData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        attachmentCount: files.length
      };

      await onSave(taskData);
      toast.success(task ? "Task updated successfully" : "Task created successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to save task");
    } finally {
      setIsSubmitting(false);
    }
  };

  // File upload handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileUpload(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFileUpload(selectedFiles);
  };

  const handleFileUpload = async (fileList) => {
    if (!task?.Id) {
      toast.error("Please save the task first before uploading files");
      return;
    }

    const validFiles = fileList.filter(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`File ${file.name} is too large. Max size is 10MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newUploadingFiles = validFiles.map(file => ({
      file,
      progress: 0,
      id: Math.random().toString(36).substr(2, 9)
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    for (const uploadingFile of newUploadingFiles) {
      try {
        const fileData = await fileService.uploadFile(
          uploadingFile.file,
          task.Id,
          (progress) => {
            setUploadingFiles(prev => 
              prev.map(f => 
                f.id === uploadingFile.id 
                  ? { ...f, progress } 
                  : f
              )
            );
          }
        );

        // Create file record in database
        const createdFile = await fileService.create(fileData);
        
        if (createdFile) {
          setFiles(prev => [...prev, createdFile]);
          toast.success(`${uploadingFile.file.name} uploaded successfully`);
        } else {
          toast.error(`Failed to upload ${uploadingFile.file.name}`);
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(`Failed to upload ${uploadingFile.file.name}`);
      }
    }

    // Remove completed uploads
    setUploadingFiles(prev => 
      prev.filter(f => !newUploadingFiles.some(nf => nf.id === f.id))
    );
  };

  const handleFileDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const success = await fileService.delete(fileId);
      if (success) {
        setFiles(prev => prev.filter(f => f.Id !== fileId));
        toast.success("File deleted successfully");
      } else {
        toast.error("Failed to delete file");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete file");
    }
  };

  const renderFilePreview = (file) => {
    const fileIcon = fileService.getFileIcon(file.type_c);
    const isImage = file.type_c?.startsWith('image/');
    
    return (
      <div key={file.Id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border">
        <div className="flex-shrink-0">
          {isImage ? (
            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="Image" className="h-5 w-5 text-gray-500" />
            </div>
          ) : (
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ApperIcon name={fileIcon} className="h-5 w-5 text-blue-600" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {file.Name}
          </p>
          <p className="text-xs text-gray-500">
            {fileService.formatFileSize(file.size_c)} • {file.type_c}
          </p>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFileDelete(file.Id)}
          className="text-error hover:bg-error/10 p-1"
        >
          <ApperIcon name="Trash2" className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const handleDelete = async () => {
    if (!task) return;
    
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await onDelete(task.Id);
        toast.success("Task deleted successfully");
        onClose();
      } catch (error) {
        toast.error("Failed to delete task");
      }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await onAddComment({
        taskId: task.Id,
        content: newComment,
        author: "Current User"
      });
      setNewComment("");
      toast.success("Comment added");
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "secondary";
    }
  };

  const statusOptions = [
    { value: "todo", label: "To Do", icon: "Circle" },
    { value: "inprogress", label: "In Progress", icon: "Clock" },
    { value: "done", label: "Done", icon: "CheckCircle" }
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" }
  ];
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <div className="flex h-full">
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Edit3" className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">
                  {task ? "Edit Task" : "Create Task"}
                </h2>
                {task && (
                  <Badge variant="secondary" className="text-xs">
                    #{task.Id}
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {task && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="text-error hover:bg-error/10"
                  >
                    <ApperIcon name="Trash2" className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                >
                  <ApperIcon name="X" className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <Label htmlFor="title" className="required">Task Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter task title..."
                    className="text-lg font-semibold"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the task..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                  />
                </div>

                {/* Row 1: Status, Priority, Assignee */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <select
                      id="priority"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    >
                      {priorityOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="assignee">Assignee</Label>
                    <select
                      id="assignee"
                      value={formData.assignee}
                      onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    >
                      <option value="">Unassigned</option>
                      {projectMembers.map(member => (
                        <option key={member} value={member}>
                          {member}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

{/* Row 2: Due Date, Progress */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="progress">Progress ({formData.progress}%)</Label>
                    <div className="space-y-2">
                      <input
                        id="progress"
                        type="range"
                        min="0"
                        max="100"
                        value={formData.progress}
                        onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                      />
                      <Progress value={formData.progress} />
                    </div>
                  </div>
                </div>

                {/* File Upload Section */}
                {task && (
                  <div className="space-y-4">
                    <Label>Attachments ({files.length})</Label>
                    
                    {/* File Upload Area */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        isDragOver 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-300 hover:border-primary/50'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <ApperIcon name="Upload" className="h-6 w-6 text-gray-500" />
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Drag and drop files here, or{' '}
                            <label className="text-primary hover:text-primary-dark cursor-pointer">
                              browse
                              <input
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleFileSelect}
                                accept="*/*"
                              />
                            </label>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Maximum file size: 10MB
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Upload Progress */}
                    {uploadingFiles.length > 0 && (
                      <div className="space-y-2">
                        {uploadingFiles.map((uploadingFile) => (
                          <div key={uploadingFile.id} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                            <ApperIcon name="Upload" className="h-4 w-4 text-blue-600" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {uploadingFile.file.name}
                              </p>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div 
                                  className="bg-primary h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${uploadingFile.progress}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">
                              {Math.round(uploadingFile.progress)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* File List */}
                    {loadingFiles ? (
                      <div className="flex items-center justify-center py-4">
                        <ApperIcon name="Loader" className="h-5 w-5 animate-spin text-gray-500" />
                        <span className="ml-2 text-sm text-gray-500">Loading attachments...</span>
                      </div>
                    ) : files.length > 0 ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {files.map(renderFilePreview)}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <ApperIcon name="FileText" className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No attachments</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-w-[100px]"
                  >
                    {isSubmitting ? (
                      <ApperIcon name="Loader" className="h-4 w-4 animate-spin" />
                    ) : (
                      task ? "Update" : "Create"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Comments Sidebar */}
          {task && (
            <div className="w-80 border-l border-gray-200 bg-gray-50/50 flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Task Details</h3>
                  <Badge variant={getPriorityColor(formData.priority)}>
                    {formData.priority}
                  </Badge>
                </div>

                {/* Task Meta */}
                <div className="space-y-3 text-sm">
                  {formData.assignee && (
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="User" className="h-4 w-4 text-gray-400" />
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {getInitials(formData.assignee)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-700">{formData.assignee}</span>
                    </div>
                  )}

                  {formData.dueDate && (
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Calendar" className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">
                        Due {format(new Date(formData.dueDate), "MMM d, yyyy")}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <ApperIcon name="BarChart3" className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{formData.progress}% complete</span>
                  </div>

                  {task.createdAt && (
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Clock" className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">
                        Created {format(new Date(task.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
{/* Comments */}
              <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-white">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Comments ({comments.length})
                  </h3>
                  
                  <form onSubmit={handleAddComment} className="space-y-2">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!newComment.trim()}
                      className="w-full"
                    >
                      <ApperIcon name="Send" className="h-3 w-3 mr-1" />
                      Comment
                    </Button>
                  </form>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.Id} className="flex space-x-3">
                      <Avatar className="h-6 w-6 shrink-0">
                        <AvatarFallback className="text-xs">
                          {getInitials(comment.author)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {comment.author}
                          </span>
                          <span className="text-xs text-gray-500">
                            {format(new Date(comment.timestamp), "MMM d, h:mm a")}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}

                  {comments.length === 0 && (
                    <div className="text-center py-8">
                      <ApperIcon name="MessageCircle" className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No comments yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TaskModal;