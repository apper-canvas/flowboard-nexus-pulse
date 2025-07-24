import React, { useState } from "react";
import { motion } from "framer-motion";
import TaskCard from "@/components/molecules/TaskCard";
import SearchBar from "@/components/molecules/SearchBar";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";

const MyTasks = () => {
  const { tasks, loading: tasksLoading, error: tasksError, refetch } = useTasks();
  const { projects } = useProjects();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // For demo purposes, filter tasks assigned to "current user"
  const myTasks = tasks.filter(task => 
    task.assignee && (
      task.assignee.includes("John") || 
      task.assignee.includes("Sarah") ||
      task.assignee.includes("Mike")
    )
  );

  // Add project names to tasks
  const enrichedTasks = myTasks.map(task => {
    const project = projects.find(p => p.Id === task.projectId);
    return {
      ...task,
      projectName: project?.name || "Unknown Project"
    };
  });

  // Filter tasks
  const filteredTasks = enrichedTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Group tasks by status
  const tasksByStatus = {
    todo: filteredTasks.filter(t => t.status === "todo"),
    inprogress: filteredTasks.filter(t => t.status === "inprogress"),
    done: filteredTasks.filter(t => t.status === "done")
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "todo":
        return "Circle";
      case "inprogress":
        return "Clock";
      case "done":
        return "CheckCircle";
      default:
        return "Circle";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "todo":
        return "text-gray-500 bg-gray-50";
      case "inprogress":
        return "text-blue-500 bg-blue-50";
      case "done":
        return "text-emerald-500 bg-emerald-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  if (tasksLoading) {
    return <Loading type="dashboard" />;
  }

  if (tasksError) {
    return <Error message={tasksError} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            My Tasks
          </h1>
          <p className="text-gray-600 mt-1">
            Stay on top of your assigned tasks and deadlines
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            {filteredTasks.length} tasks
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <SearchBar
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-80"
        />
      </div>

      {/* Tasks Content */}
      {filteredTasks.length === 0 ? (
        <Empty
          type="tasks"
          title="No tasks assigned"
          message="You don't have any tasks assigned yet. Check back later or contact your project manager."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <div key={status} className="space-y-4">
              {/* Status Header */}
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg ${getStatusColor(status)}`}>
                  <ApperIcon name={getStatusIcon(status)} className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-gray-900 capitalize">
                  {status === "inprogress" ? "In Progress" : status}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {statusTasks.length}
                </Badge>
              </div>

              {/* Tasks */}
              <div className="space-y-3">
                {statusTasks.map((task, index) => (
                  <motion.div
                    key={task.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {task.title}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {task.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {task.projectName}
                          </Badge>
                          {task.priority && (
                            <Badge 
                              variant={task.priority === "high" ? "error" : task.priority === "medium" ? "warning" : "success"}
                              className="text-xs"
                            >
                              {task.priority}
                            </Badge>
                          )}
                        </div>

                        {task.dueDate && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <ApperIcon name="Calendar" className="h-3 w-3" />
                            <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}

                        {task.progress > 0 && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium text-primary">{task.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {statusTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ApperIcon name="Package" className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No {status} tasks</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasks;