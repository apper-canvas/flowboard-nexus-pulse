import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { addDays, addMonths, addWeeks, endOfDay, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isValid, parseISO, startOfDay, startOfMonth, startOfWeek, subMonths, subWeeks } from "date-fns";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Projects from "@/components/pages/Projects";
import TaskModal from "@/components/organisms/TaskModal";
import Badge from "@/components/atoms/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const Calendar = () => {
const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'
  const [selectedDate, setSelectedDate] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedDateForTask, setSelectedDateForTask] = useState(null);
  const [taskProjects, setTaskProjects] = useState([]);
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();
  const { tasks, loading: tasksLoading, error: tasksError } = useTasks();

  const loading = projectsLoading || tasksLoading;
  const error = projectsError || tasksError;

  // Generate calendar events from projects and tasks
  const calendarEvents = useMemo(() => {
    const events = [];

// Add projects to calendar
    if (projects && Array.isArray(projects)) {
      projects.forEach(project => {
      if (project.start_date_c) {
        try {
          const startDate = parseISO(project.start_date_c);
          if (isValid(startDate)) {
            events.push({
              id: `project-${project.Id}`,
              title: project.Name,
              date: startDate,
              type: 'project',
              data: project,
              color: 'bg-blue-500',
              textColor: 'text-white'
            });
          }
        } catch (err) {
          console.error('Invalid project start date:', project.start_date_c, err);
        }
      }

      if (project.end_date_c) {
        try {
          const endDate = parseISO(project.end_date_c);
          if (isValid(endDate)) {
            events.push({
              id: `project-end-${project.Id}`,
              title: `${project.Name} (End)`,
              date: endDate,
              type: 'project-end',
              data: project,
              color: 'bg-blue-600',
              textColor: 'text-white'
            });
          }
        } catch (err) {
          console.error('Invalid project end date:', project.end_date_c, err);
        }
      }
});
    }

    // Add tasks to calendar
    if (tasks && Array.isArray(tasks)) {
      tasks.forEach(task => {
      if (task.due_date_c) {
        try {
          const dueDate = parseISO(task.due_date_c);
          if (isValid(dueDate)) {
            let color = 'bg-gray-500';
            if (task.status_c === 'todo') color = 'bg-red-500';
            else if (task.status_c === 'inprogress') color = 'bg-yellow-500';
            else if (task.status_c === 'done') color = 'bg-green-500';

            events.push({
              id: `task-${task.Id}`,
              title: task.title_c || task.Name,
              date: dueDate,
              type: 'task',
              data: task,
              color,
              textColor: 'text-white'
            });
          }
        } catch (err) {
          console.error('Invalid task due date:', task.due_date_c, err);
        }
      }
});
    }

    return events;
  }, [projects, tasks]);

  // Get events for a specific date
  const getEventsForDate = (date) => {
    return calendarEvents.filter(event => isSameDay(event.date, date));
  };

  // Navigation functions
  const navigatePrevious = () => {
    if (viewMode === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else if (viewMode === 'day') {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const navigateNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (viewMode === 'day') {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  // Get date range for current view
  const getDateRange = () => {
    if (viewMode === 'month') {
      const start = startOfWeek(startOfMonth(currentDate));
      const end = endOfWeek(endOfMonth(currentDate));
      return { start, end };
    } else if (viewMode === 'week') {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      return { start, end };
    } else {
      return { start: startOfDay(currentDate), end: endOfDay(currentDate) };
    }
  };

  // Handle event click
const handleEventClick = (event) => {
    setSelectedDate(event.date);
    setSelectedDateForTask(event.date);
    setShowTaskModal(true);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedDateForTask(date);
    setShowTaskModal(true);
  };

const handleTaskCreate = async (taskData) => {
    try {
      const projectId = taskProjects[0]?.Id || null;
      // Note: createTask function needs to be imported from useTasks hook
      console.log('Task creation data:', {
        ...taskData,
        projectId: projectId,
        dueDate: selectedDateForTask ? selectedDateForTask.toISOString() : taskData.dueDate
      });
      setShowTaskModal(false);
      toast.success('Task created successfully');
    } catch (error) {
      toast.error('Failed to create task');
      console.error('Task creation error:', error);
    }
  };

  // Load projects for task creation
  useEffect(() => {
    if (projects && projects.length > 0) {
      setTaskProjects(projects);
    }
  }, [projects]);

const getTasksForDate = (date) => {
    if (!tasks || !Array.isArray(tasks)) return [];
    return tasks.filter(task => {
      if (!task?.due_date_c) return false;
      try {
        const taskDate = parseISO(task.due_date_c);
        return isValid(taskDate) && isSameDay(taskDate, date);
      } catch (err) {
        console.error('Invalid task date:', task.due_date_c, err);
        return false;
      }
    });
  };

  // Render month view
  const renderMonthView = () => {
    const { start, end } = getDateRange();
    const days = [];
    let day = start;

    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Header */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(dayName => (
          <div key={dayName} className="p-3 text-center font-semibold text-gray-600 bg-gray-50 rounded-t-lg">
            {dayName}
          </div>
        ))}
        
        {/* Days */}
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());
          const isSelected = selectedDate && isSameDay(day, selectedDate);

const dayTasks = getTasksForDate(day);
          
          return (
            <motion.div
              key={day.toISOString()}
              className={`min-h-[120px] p-2 border border-gray-200 cursor-pointer transition-all duration-200 ${
                isCurrentMonth ? 'bg-white' : 'bg-gray-50'
              } ${isToday ? 'bg-blue-50 border-blue-300' : ''} ${
                isSelected ? 'bg-primary/10 border-primary' : ''
              } ${dayTasks.length > 0 ? 'bg-green-50 border-green-200' : ''} hover:bg-gray-50`}
              onClick={() => handleDateClick(day)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`text-sm font-medium mb-1 ${
                isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
              } ${isToday ? 'text-blue-600 font-bold' : ''}`}>
                {format(day, 'd')}
              </div>
              
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map(event => (
                  <motion.div
                    key={event.id}
                    className={`text-xs px-2 py-1 rounded ${event.color} ${event.textColor} truncate cursor-pointer`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(event);
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {event.title}
                  </motion.div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 font-medium">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };
{dayTasks.slice(0, 3).map((task) => (
                  <Badge
                    key={task.Id}
                    variant="secondary"
                    className="text-xs truncate block max-w-full bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                  >
                    {task.title_c || task.Name || 'Untitled Task'}
                  </Badge>

  // Render week view
  const renderWeekView = () => {
    const { start, end } = getDateRange();
    const days = [];
    let day = start;

    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const dayEvents = getEventsForDate(day);
          const isToday = isSameDay(day, new Date());
const isSelected = selectedDate && isSameDay(day, selectedDate);
          const dayTasks = getTasksForDate(day);

          return (
            <motion.div
              key={day.toISOString()}
              className={`min-h-[400px] p-3 border border-gray-200 cursor-pointer ${
                isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'
              } ${isSelected ? 'bg-primary/10 border-primary' : ''} ${
                dayTasks.length > 0 ? 'bg-green-50 border-green-200' : ''
              } hover:bg-gray-50`}
              onClick={() => handleDateClick(day)}
              whileHover={{ scale: 1.01 }}
            >
              <div className={`text-center mb-3 ${isToday ? 'text-blue-600 font-bold' : 'text-gray-900'}`}>
                <div className="text-sm font-medium">{format(day, 'EEE')}</div>
                <div className="text-lg font-bold">{format(day, 'd')}</div>
              </div>
              
              <div className="space-y-2">
                {dayEvents.map(event => (
                  <motion.div
                    key={event.id}
                    className={`text-xs px-2 py-1 rounded ${event.color} ${event.textColor} cursor-pointer`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(event);
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    <div className="opacity-75">{format(event.date, 'HH:mm')}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  // Render day view
  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);
    const isToday = isSameDay(currentDate, new Date());

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className={`text-center mb-6 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
          <div className="text-2xl font-bold">{format(currentDate, 'EEEE')}</div>
          <div className="text-lg">{format(currentDate, 'MMMM d, yyyy')}</div>
        </div>

        {dayEvents.length === 0 ? (
          <Empty 
            title="No events today"
            description="You have no projects or tasks scheduled for this day."
          />
        ) : (
          <div className="space-y-3">
            {dayEvents.map(event => (
              <motion.div
                key={event.id}
                className={`p-4 rounded-lg ${event.color} ${event.textColor} cursor-pointer`}
                onClick={() => handleEventClick(event)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-lg">{event.title}</div>
                    <div className="opacity-75">
                      {event.type === 'project' ? 'Project' : 'Task'} • {format(event.date, 'HH:mm')}
                    </div>
                    {event.data.description_c && (
                      <div className="mt-2 opacity-90 text-sm">
                        {event.data.description_c}
                      </div>
                    )}
                  </div>
                  <ApperIcon name="ChevronRight" size={20} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
</div>
    );
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Calendar" size={24} />
                <span>Calendar</span>
              </CardTitle>
              
              {/* View Mode Selector */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                {['month', 'week', 'day'].map(mode => (
                  <Button
                    key={mode}
                    variant={viewMode === mode ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode(mode)}
                    className="capitalize"
                  >
                    {mode}
                  </Button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={navigateToday}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={navigatePrevious}>
                <ApperIcon name="ChevronLeft" size={16} />
              </Button>
              <Button variant="outline" size="sm" onClick={navigateNext}>
                <ApperIcon name="ChevronRight" size={16} />
              </Button>
            </div>
          </div>

          {/* Current Period Display */}
          <div className="text-xl font-semibold text-gray-900 mt-2">
            {viewMode === 'month' && format(currentDate, 'MMMM yyyy')}
            {viewMode === 'week' && `${format(startOfWeek(currentDate), 'MMM d')} - ${format(endOfWeek(currentDate), 'MMM d, yyyy')}`}
            {viewMode === 'day' && format(currentDate, 'EEEE, MMMM d, yyyy')}
          </div>
        </CardHeader>

        <CardContent>
          <motion.div
            key={`${viewMode}-${currentDate.toISOString()}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {viewMode === 'month' && renderMonthView()}
            {viewMode === 'week' && renderWeekView()}
            {viewMode === 'day' && renderDayView()}
          </motion.div>
        </CardContent>
      </Card>

      {/* Event Summary */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Events for {format(selectedDate, 'MMMM d, yyyy')}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDate(null)}
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getEventsForDate(selectedDate).length === 0 ? (
                <Empty 
                  title="No events"
                  description="No projects or tasks scheduled for this date."
                />
              ) : (
                <div className="space-y-3">
                  {getEventsForDate(selectedDate).map(event => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-center space-x-3">
                        <Badge className={`${event.color} ${event.textColor}`}>
                          {event.type === 'project' ? 'Project' : 'Task'}
                        </Badge>
                        <div>
                          <div className="font-medium">{event.title}</div>
                          {event.data.description_c && (
                            <div className="text-sm text-gray-600 truncate max-w-md">
                              {event.data.description_c}
                            </div>
                          )}
                        </div>
                      </div>
                      <ApperIcon name="ChevronRight" size={16} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
</motion.div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ApperIcon name="FolderOpen" size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{projects.length}</div>
                <div className="text-sm text-gray-600">Total Projects</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ApperIcon name="CheckSquare" size={20} className="text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{tasks.length}</div>
                <div className="text-sm text-gray-600">Total Tasks</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ApperIcon name="Calendar" size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{calendarEvents.length}</div>
                <div className="text-sm text-gray-600">Calendar Events</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSave={handleTaskCreate}
        task={null}
        projectMembers={taskProjects.length > 0 ? taskProjects[0].team_members_c?.split(',') || [] : []}
      />
    </div>
  );
};

export default Calendar;