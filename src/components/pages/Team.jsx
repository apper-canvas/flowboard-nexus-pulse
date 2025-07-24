import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import ApperIcon from "@/components/ApperIcon";
import { Card } from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import TeamMemberAvatar from "@/components/molecules/TeamMemberAvatar";
import SearchBar from "@/components/molecules/SearchBar";

const Team = () => {
  const { projects, loading: projectsLoading, error: projectsError, refetch } = useProjects();
  const { tasks, loading: tasksLoading } = useTasks();
  const [searchTerm, setSearchTerm] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    if (projects.length > 0) {
      // Aggregate all team members from projects
      const memberStats = {};
      
      projects.forEach(project => {
        if (project.teamMembers && Array.isArray(project.teamMembers)) {
          project.teamMembers.forEach(member => {
            if (!memberStats[member]) {
              memberStats[member] = {
                name: member,
                projects: [],
                totalTasks: 0,
                activeTasks: 0,
                completedTasks: 0
              };
            }
            memberStats[member].projects.push({
              id: project.Id,
              name: project.name,
              status: project.status
            });
          });
        }
      });

      // Add task statistics
      if (tasks && tasks.length > 0) {
        tasks.forEach(task => {
          if (task.assignee && memberStats[task.assignee]) {
            memberStats[task.assignee].totalTasks++;
            if (task.status === 'done') {
              memberStats[task.assignee].completedTasks++;
            } else {
              memberStats[task.assignee].activeTasks++;
            }
          }
        });
      }

      setTeamMembers(Object.values(memberStats));
    }
  }, [projects, tasks]);

  // Filter team members based on search
  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (projectsLoading || tasksLoading) {
    return <Loading type="page" />;
  }

  if (projectsError) {
    return <Error message={projectsError} onRetry={refetch} />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Team Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your team members and track their project assignments.
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <SearchBar
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <ApperIcon name="Users" className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-success">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.filter(p => p.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-success/10 rounded-full">
              <ApperIcon name="FolderOpen" className="h-6 w-6 text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-warning">Active Tasks</p>
              <p className="text-2xl font-bold text-gray-900">
                {teamMembers.reduce((sum, member) => sum + member.activeTasks, 0)}
              </p>
            </div>
            <div className="p-3 bg-warning/10 rounded-full">
              <ApperIcon name="CheckSquare" className="h-6 w-6 text-warning" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-info/5 to-info/10 border-info/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-info">Completed Tasks</p>
              <p className="text-2xl font-bold text-gray-900">
                {teamMembers.reduce((sum, member) => sum + member.completedTasks, 0)}
              </p>
            </div>
            <div className="p-3 bg-info/10 rounded-full">
              <ApperIcon name="CheckCircle" className="h-6 w-6 text-info" />
            </div>
          </div>
        </Card>
      </div>

      {/* Team Members Grid */}
      {filteredMembers.length === 0 ? (
        <Empty
          icon="Users"
          title="No Team Members Found"
          description={searchTerm ? "No team members match your search criteria." : "No team members have been assigned to projects yet."}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-cardHover transition-all duration-200 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <TeamMemberAvatar member={member.name} size="lg" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-500">Team Member</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-xs text-success font-medium">Active</span>
                  </div>
                </div>

                {/* Project Assignments */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Projects ({member.projects.length})
                  </h4>
                  <div className="space-y-1 max-h-20 overflow-y-auto">
                    {member.projects.map(project => (
                      <div key={project.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 truncate">{project.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.status === 'active' ? 'bg-success/10 text-success' :
                          project.status === 'completed' ? 'bg-primary/10 text-primary' :
                          'bg-warning/10 text-warning'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Task Statistics */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{member.totalTasks}</p>
                    <p className="text-xs text-gray-500">Total Tasks</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-warning">{member.activeTasks}</p>
                    <p className="text-xs text-gray-500">Active</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-success">{member.completedTasks}</p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                </div>

                {/* Performance Indicator */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-medium text-gray-900">
                      {member.totalTasks > 0 
                        ? Math.round((member.completedTasks / member.totalTasks) * 100)
                        : 0
                      }%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${member.totalTasks > 0 
                          ? (member.completedTasks / member.totalTasks) * 100 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Team;