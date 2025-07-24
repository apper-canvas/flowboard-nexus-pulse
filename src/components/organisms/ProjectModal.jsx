import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const ProjectModal = ({ project, isOpen, onClose, onSave }) => {
const [formData, setFormData] = useState({
    name: "",
    description: "",
    teamMembers: [],
    status: "active"
  });
  const [newMember, setNewMember] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

useEffect(() => {
    if (project) {
      setFormData({
name: project.name || "",
        description: project.description || "",
        teamMembers: project.teamMembers || [],
        status: project.status || "active"
      });
    } else {
      setFormData({
name: "",
        description: "",
        teamMembers: [],
        status: "active"
      });
    }
  }, [project]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
      toast.success(project ? "Project updated successfully" : "Project created successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to save project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.trim()) return;
    
    if (formData.teamMembers.includes(newMember)) {
      toast.error("Member already added");
      return;
    }

    setFormData({
      ...formData,
      teamMembers: [...formData.teamMembers, newMember]
    });
    setNewMember("");
  };

  const handleRemoveMember = (memberToRemove) => {
    setFormData({
      ...formData,
      teamMembers: formData.teamMembers.filter(member => member !== memberToRemove)
    });
  };

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "on-hold", label: "On Hold" },
    { value: "completed", label: "Completed" }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center space-x-3">
            <ApperIcon name="FolderPlus" className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">
              {project ? "Edit Project" : "New Project"}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <ApperIcon name="X" className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Name */}
            <div>
              <Label htmlFor="name" className="required">Project Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter project name..."
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
                placeholder="Describe the project goals and objectives..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
              />
</div>

            {/* Status */}
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

            {/* Team Members */}
            <div>
              <Label>Team Members</Label>
              
              {/* Add Member Form */}
              <div className="flex space-x-2 mb-3">
                <Input
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  placeholder="Enter team member name..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddMember}
                  disabled={!newMember.trim()}
                  size="sm"
                >
                  <ApperIcon name="Plus" className="h-4 w-4" />
                </Button>
              </div>

              {/* Members List */}
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {formData.teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          {member.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{member}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member)}
                      className="text-error hover:bg-error/10 p-1"
                    >
                      <ApperIcon name="X" className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                
                {formData.teamMembers.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <ApperIcon name="Users" className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No team members added yet</p>
                  </div>
                )}
              </div>
            </div>

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
                  project ? "Update" : "Create"
                )}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectModal;