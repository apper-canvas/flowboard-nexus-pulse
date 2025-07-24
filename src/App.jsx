import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/pages/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Projects from "@/components/pages/Projects";
import ProjectDetail from "@/components/pages/ProjectDetail";
import MyTasks from "@/components/pages/MyTasks";
import { useOutletContext } from "react-router-dom";

// Wrapper components to pass props from outlet context
const DashboardWrapper = () => {
  const { onNewProject } = useOutletContext();
  return <Dashboard onNewProject={onNewProject} />;
};

const ProjectsWrapper = () => {
  const { onNewProject } = useOutletContext();
  return <Projects onNewProject={onNewProject} />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<DashboardWrapper />} />
            <Route path="projects" element={<ProjectsWrapper />} />
            <Route path="project/:projectId" element={<ProjectDetail />} />
            <Route path="my-tasks" element={<MyTasks />} />
            <Route path="calendar" element={
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📅</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Calendar View</h2>
                  <p className="text-gray-600">Calendar integration coming soon!</p>
                </div>
              </div>
            } />
            <Route path="team" element={
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">👥</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Team Management</h2>
                  <p className="text-gray-600">Team management features coming soon!</p>
                </div>
              </div>
            } />
            <Route path="settings" element={
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚙️</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Settings</h2>
                  <p className="text-gray-600">Application settings coming soon!</p>
                </div>
              </div>
            } />
          </Route>
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;