import { delay } from '@/utils/delay';

const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const fileService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "size_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "uploadDate_c" } },
          { field: { Name: "task_id_c" } },
          { field: { Name: "fileLocation_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } }
        ],
        orderBy: [
          {
            fieldName: "CreatedOn",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('file_c', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching files:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getByTaskId(taskId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "size_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "uploadDate_c" } },
          { field: { Name: "task_id_c" } },
          { field: { Name: "fileLocation_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } }
        ],
        where: [
          {
            FieldName: "task_id_c",
            Operator: "EqualTo",
            Values: [parseInt(taskId)]
          }
        ],
        orderBy: [
          {
            fieldName: "CreatedOn",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('file_c', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching task files:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(fileId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "size_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "uploadDate_c" } },
          { field: { Name: "task_id_c" } },
          { field: { Name: "fileLocation_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } }
        ]
      };

      const response = await apperClient.getRecordById('file_c', fileId, params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching file with ID ${fileId}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(fileData) {
    try {
      const params = {
        records: [
          {
            Name: fileData.Name,
            size_c: fileData.size_c,
            type_c: fileData.type_c,
            uploadDate_c: fileData.uploadDate_c,
            task_id_c: parseInt(fileData.task_id_c),
            fileLocation_c: fileData.fileLocation_c
          }
        ]
      };

      const response = await apperClient.createRecord('file_c', params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} file records:${JSON.stringify(failedRecords)}`);
        }

        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating file record:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(fileId, updateData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(fileId),
            ...updateData
          }
        ]
      };

      const response = await apperClient.updateRecord('file_c', params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} file records:${JSON.stringify(failedUpdates)}`);
        }

        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating file record:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async delete(fileId) {
    try {
      const params = {
        RecordIds: [parseInt(fileId)]
      };

      const response = await apperClient.deleteRecord('file_c', params);

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} file records:${JSON.stringify(failedDeletions)}`);
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting file record:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  // Simulate file upload to a storage service
  async uploadFile(file, taskId, onProgress) {
    return new Promise((resolve, reject) => {
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 100) progress = 100;
        
        onProgress?.(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          
          // Simulate successful upload
          setTimeout(() => {
            const mockFileLocation = `uploads/task-${taskId}/${Date.now()}-${file.name}`;
            resolve({
              Name: file.name,
              size_c: file.size,
              type_c: file.type,
              uploadDate_c: new Date().toISOString(),
              task_id_c: taskId,
              fileLocation_c: mockFileLocation
            });
          }, 500);
        }
      }, 200);
    });
  },

  // Get file type icon
  getFileIcon(fileType) {
    if (!fileType) return 'File';
    
    const type = fileType.toLowerCase();
    
    if (type.includes('image')) return 'Image';
    if (type.includes('pdf')) return 'FileText';
    if (type.includes('word') || type.includes('document')) return 'FileText';
    if (type.includes('excel') || type.includes('spreadsheet')) return 'Sheet';
    if (type.includes('powerpoint') || type.includes('presentation')) return 'Presentation';
    if (type.includes('video')) return 'Video';
    if (type.includes('audio')) return 'Music';
    if (type.includes('zip') || type.includes('archive')) return 'Archive';
    if (type.includes('text')) return 'FileText';
    
    return 'File';
  },

  // Format file size
  formatFileSize(bytes) {
    if (!bytes) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
};