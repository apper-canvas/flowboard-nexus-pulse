import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import TaskModal from "@/components/organisms/TaskModal";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Progress from "@/components/atoms/Progress";
import { Avatar, AvatarFallback } from "@/components/atoms/Avatar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { useTasks } from "@/hooks/useTasks";
import { useComments } from "@/hooks/useComments";
import { useProjects } from "@/hooks/useProjects";
import { toast } from "react-toastify";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, loading: projectLoading, updateProject } = useProjects();
  const { tasks, loading: tasksLoading, createTask, updateTask, deleteTask, refetch: refetchTasks } = useTasks(projectId);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [viewMode, setViewMode] = useState("kanban");

  const project = projects.find(p => p.Id === parseInt(projectId));

  const { comments, addComment } = useComments(selectedTask?.Id);

  useEffect(() => {
    if (!project && !projectLoading && projects.length > 0) {
      toast.error("Project not found");
      navigate("/dashboard");
    }
  }, [project, projectLoading, projects, navigate]);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleNewTask = () => {
    setSelectedTask(null);
    setShowTaskModal(true);
  };

  const handleTaskSave = async (taskData) => {
    try {
      if (selectedTask) {
        await updateTask(selectedTask.Id, taskData);
      } else {
        await createTask({ ...taskData, projectId: parseInt(projectId) });
      }
      await refetchTasks();
      setShowTaskModal(false);
      setSelectedTask(null);
    } catch (error) {
      throw error;
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      await refetchTasks();
      setShowTaskModal(false);
      setSelectedTask(null);
    } catch (error) {
      throw error;
    }
  };

  const handleTaskUpdate = async (taskId, updateData) => {
    try {
      await updateTask(taskId, updateData);
      await refetchTasks();
    } catch (error) {
      toast.error("Failed to update task");
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

  const getStatusVariant = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "completed":
        return "default";
      case "on-hold":
        return "warning";
      default:
        return "secondary";
    }
  };

  if (projectLoading || tasksLoading) {
    return <Loading type="kanban" />;
  }

  if (!project) {
    return (
      <Error 
        type="notfound"
        title="Project Not Found"
        message="The project you're looking for doesn't exist or you don't have access to it."
        onRetry={() => navigate("/dashboard")}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Project Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
            >
              <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {project.name}
                </h1>
                <Badge variant={getStatusVariant(project.status)}>
                  {project.status}
                </Badge>
              </div>
              
              {project.description && (
                <p className="text-gray-600 text-sm max-w-2xl">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("kanban")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  viewMode === "kanban"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <ApperIcon name="Trello" className="h-4 w-4 mr-1.5" />
                Board
              </button>
              <button
                onClick={() => setViewMode("gantt")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  viewMode === "gantt"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <ApperIcon name="BarChart3" className="h-4 w-4 mr-1.5" />
                Timeline
              </button>
            </div>

            <Button
              onClick={handleNewTask}
              className="shadow-md"
            >
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Project Stats */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <ApperIcon name="CheckSquare" className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {project.taskCounts?.completed || 0} / {project.taskCounts?.total || 0} tasks completed
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <ApperIcon name="TrendingUp" className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{project.progress || 0}% complete</span>
            </div>

            <div className="w-32">
              <Progress value={project.progress || 0} />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Team:</span>
            <div className="flex -space-x-2">
              {project.teamMembers?.slice(0, 5).map((member, index) => (
                <Avatar key={index} className="h-7 w-7 border-2 border-white">
                  <AvatarFallback className="text-xs">
                    {getInitials(member)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {project.teamMembers?.length > 5 && (
                <div className="h-7 w-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-gray-600 font-medium">
                    +{project.teamMembers.length - 5}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === "kanban" ? (
          <KanbanBoard
            tasks={tasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskClick={handleTaskClick}
            onNewTask={handleNewTask}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <ApperIcon name="BarChart3" className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Timeline View</h3>
              <p className="text-gray-600">Gantt chart view coming soon!</p>
            </div>
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        task={selectedTask}
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setSelectedTask(null);
        }}
        onSave={handleTaskSave}
        onDelete={handleTaskDelete}
        projectMembers={project.teamMembers || []}
        comments={comments}
        onAddComment={addComment}
      />
    </div>
  );
};

export default ProjectDetail;