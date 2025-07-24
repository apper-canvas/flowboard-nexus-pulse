import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import ProjectModal from "@/components/organisms/ProjectModal";
import { useProjects } from "@/hooks/useProjects";
import { toast } from "react-toastify";

const Layout = () => {
  const { projects, createProject, updateProject } = useProjects();
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleNewProject = () => {
    setSelectedProject(null);
    setShowProjectModal(true);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  const handleProjectSave = async (projectData) => {
    try {
      if (selectedProject) {
        await updateProject(selectedProject.Id, projectData);
      } else {
        await createProject(projectData);
      }
      setShowProjectModal(false);
      setSelectedProject(null);
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        projects={projects} 
        onNewProject={handleNewProject}
      />
      
      <div className="lg:ml-64">
        <main className="p-6 lg:p-8">
          <Outlet context={{ onNewProject: handleNewProject }} />
        </main>
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={showProjectModal}
        onClose={() => {
          setShowProjectModal(false);
          setSelectedProject(null);
        }}
        onSave={handleProjectSave}
      />
    </div>
  );
};

export default Layout;