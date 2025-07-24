/**
 * Settings Service - Handles all settings-related database operations
 * Uses ApperClient for backend integration with the setting_c table
 */

const { ApperClient } = window.ApperSDK;

class SettingsService {
  constructor() {
    this.client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'setting_c';
  }

  /**
   * Get all settings with optional search and filtering
   */
  async getAll(searchTerm = '', typeFilter = '') {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "value_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        orderBy: [
          {
            fieldName: "Name",
            sorttype: "ASC"
          }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };

      // Add search filter if provided
      if (searchTerm || typeFilter) {
        params.where = [];
        
        if (searchTerm) {
          params.where.push({
            FieldName: "Name",
            Operator: "Contains",
            Values: [searchTerm]
          });
        }
        
        if (typeFilter) {
          params.where.push({
            FieldName: "type_c",
            Operator: "EqualTo",
            Values: [typeFilter]
          });
        }
      }

      const response = await this.client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error('Failed to fetch settings:', response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching settings:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching settings:", error.message);
        throw new Error(error.message);
      }
    }
  }

  /**
   * Get a specific setting by ID
   */
  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "value_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };

      const response = await this.client.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(`Failed to fetch setting with ID ${id}:`, response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching setting with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching setting with ID ${id}:`, error.message);
        throw new Error(error.message);
      }
    }
  }

  /**
   * Create a new setting
   * Only includes Updateable fields: Name, value_c, type_c, description_c
   */
  async create(settingData) {
    try {
      // Validate required fields
      if (!settingData.Name || !settingData.value_c || !settingData.type_c) {
        throw new Error('Name, value, and type are required fields');
      }

      // Validate type
      if (!['string', 'number', 'boolean'].includes(settingData.type_c)) {
        throw new Error('Type must be string, number, or boolean');
      }

      // Validate value based on type
      const validatedData = this.validateValueByType(settingData.value_c, settingData.type_c);

      const params = {
        records: [{
          Name: settingData.Name,
          value_c: validatedData,
          type_c: settingData.type_c,
          description_c: settingData.description_c || ''
        }]
      };

      const response = await this.client.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error('Failed to create setting:', response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create setting ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords[0]?.data;
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating setting:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating setting:", error.message);
        throw new Error(error.message);
      }
    }
  }

  /**
   * Update an existing setting
   * Only includes Updateable fields: Name, value_c, type_c, description_c
   */
  async update(id, settingData) {
    try {
      // Validate required fields
      if (!settingData.Name || !settingData.value_c || !settingData.type_c) {
        throw new Error('Name, value, and type are required fields');
      }

      // Validate type
      if (!['string', 'number', 'boolean'].includes(settingData.type_c)) {
        throw new Error('Type must be string, number, or boolean');
      }

      // Validate value based on type
      const validatedData = this.validateValueByType(settingData.value_c, settingData.type_c);

      const params = {
        records: [{
          Id: parseInt(id),
          Name: settingData.Name,
          value_c: validatedData,
          type_c: settingData.type_c,
          description_c: settingData.description_c || ''
        }]
      };

      const response = await this.client.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error('Failed to update setting:', response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update setting ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulUpdates[0]?.data;
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating setting:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating setting:", error.message);
        throw new Error(error.message);
      }
    }
  }

  /**
   * Delete settings by IDs
   */
  async delete(ids) {
    try {
      const recordIds = Array.isArray(ids) ? ids : [ids];
      
      const params = {
        RecordIds: recordIds.map(id => parseInt(id))
      };

      const response = await this.client.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error('Failed to delete settings:', response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete settings ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length === recordIds.length;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting settings:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting settings:", error.message);
        throw new Error(error.message);
      }
    }
  }

  /**
   * Validate value based on type
   */
  validateValueByType(value, type) {
    switch (type) {
      case 'number':
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          throw new Error('Value must be a valid number');
        }
        return numValue.toString();
      
      case 'boolean':
        if (typeof value === 'boolean') {
          return value.toString();
        }
        if (typeof value === 'string') {
          const lowerValue = value.toLowerCase();
          if (lowerValue === 'true' || lowerValue === 'false') {
            return lowerValue;
          }
        }
        throw new Error('Value must be true or false for boolean type');
      
      case 'string':
      default:
        return value.toString();
    }
  }
}

export default new SettingsService();