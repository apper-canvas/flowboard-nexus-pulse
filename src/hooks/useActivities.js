import { useState, useEffect } from "react";
import { activityService } from "@/services/api/activityService";

export const useActivities = (projectId = null, limit = 10) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let activitiesData;
      if (projectId) {
        activitiesData = await activityService.getByProjectId(projectId, limit);
      } else {
        activitiesData = await activityService.getRecent(limit);
      }
      
      setActivities(activitiesData);
    } catch (err) {
      setError(err.message || "Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [projectId, limit]);

  return {
    activities,
    loading,
    error,
    refetch: loadActivities
  };
};