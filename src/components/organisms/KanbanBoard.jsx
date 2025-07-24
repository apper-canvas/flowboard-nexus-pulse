import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskCard from "@/components/molecules/TaskCard";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const KanbanBoard = ({ tasks = [], onTaskUpdate, onTaskClick, onNewTask }) => {
  const [columns, setColumns] = useState({
    todo: { title: "To Do", tasks: [], color: "bg-gray-100" },
    inprogress: { title: "In Progress", tasks: [], color: "bg-blue-50" },
    done: { title: "Done", tasks: [], color: "bg-emerald-50" }
  });

  // Organize tasks by status
  useEffect(() => {
    const tasksByStatus = {
      todo: tasks.filter(task => task.status === "todo"),
      inprogress: tasks.filter(task => task.status === "inprogress"),
      done: tasks.filter(task => task.status === "done")
    };

    setColumns(prev => ({
      todo: { ...prev.todo, tasks: tasksByStatus.todo },
      inprogress: { ...prev.inprogress, tasks: tasksByStatus.inprogress },
      done: { ...prev.done, tasks: tasksByStatus.done }
    }));
  }, [tasks]);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const task = tasks.find(t => t.Id.toString() === draggableId);
    if (!task) return;

    const newStatus = destination.droppableId;
    const updatedTask = { ...task, status: newStatus };

    onTaskUpdate(task.Id, updatedTask);
    
    // Show success message
    const statusNames = {
      todo: "To Do",
      inprogress: "In Progress", 
      done: "Done"
    };
    toast.success(`Task moved to ${statusNames[newStatus]}`);
  };

  const getColumnIcon = (columnId) => {
    switch (columnId) {
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

  const getColumnCount = (columnId) => {
    return columns[columnId].tasks.length;
  };

  return (
    <div className="h-full p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Board</h2>
        <Button onClick={onNewTask} className="shadow-md">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId} className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <ApperIcon 
                    name={getColumnIcon(columnId)} 
                    className={`h-5 w-5 ${
                      columnId === "todo" ? "text-gray-500" :
                      columnId === "inprogress" ? "text-blue-500" :
                      "text-emerald-500"
                    }`} 
                  />
                  <h3 className="font-semibold text-gray-900">{column.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    columnId === "todo" ? "bg-gray-100 text-gray-600" :
                    columnId === "inprogress" ? "bg-blue-100 text-blue-600" :
                    "bg-emerald-100 text-emerald-600"
                  }`}>
                    {getColumnCount(columnId)}
                  </span>
                </div>
              </div>

              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`kanban-column flex-1 p-4 rounded-xl transition-colors duration-200 ${
                      snapshot.isDraggingOver 
                        ? columnId === "todo" ? "bg-gray-100" :
                          columnId === "inprogress" ? "bg-blue-100" :
                          "bg-emerald-100"
                        : "bg-white/50"
                    }`}
                  >
                    <div className="space-y-3">
                      {column.tasks.map((task, index) => (
                        <Draggable
                          key={task.Id}
                          draggableId={task.Id.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`${
                                snapshot.isDragging 
                                  ? "rotate-3 scale-105 shadow-xl" 
                                  : ""
                              } transition-all duration-200`}
                            >
                              <TaskCard
                                task={task}
                                onClick={() => onTaskClick(task)}
                              />
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                    {provided.placeholder}

                    {column.tasks.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <ApperIcon name="Package" className="h-12 w-12 mb-3" />
                        <p className="text-sm font-medium">No tasks</p>
                        <p className="text-xs">Drag tasks here or create new ones</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;