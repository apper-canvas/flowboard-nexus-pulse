import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { Card } from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import settingsService from '@/services/api/settingsService';

const Settings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSetting, setEditingSetting] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    value_c: '',
    type_c: 'string',
    description_c: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, [searchTerm, typeFilter]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsService.getAll(searchTerm, typeFilter);
      setSettings(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSetting = () => {
    setFormData({
      Name: '',
      value_c: '',
      type_c: 'string',
      description_c: ''
    });
    setEditingSetting(null);
    setShowAddForm(true);
  };

  const handleEditSetting = (setting) => {
    setFormData({
      Name: setting.Name || '',
      value_c: setting.value_c || '',
      type_c: setting.type_c || 'string',
      description_c: setting.description_c || ''
    });
    setEditingSetting(setting);
    setShowAddForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setFormLoading(true);
      
      if (editingSetting) {
        await settingsService.update(editingSetting.Id, formData);
        toast.success('Setting updated successfully');
      } else {
        await settingsService.create(formData);
        toast.success('Setting created successfully');
      }
      
      setShowAddForm(false);
      setEditingSetting(null);
      await loadSettings();
    } catch (err) {
      toast.error(err.message);
      console.error('Error saving setting:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteSetting = async (setting) => {
    if (!confirm(`Are you sure you want to delete the setting "${setting.Name}"?`)) {
      return;
    }

    try {
      await settingsService.delete(setting.Id);
      toast.success('Setting deleted successfully');
      await loadSettings();
    } catch (err) {
      toast.error(err.message);
      console.error('Error deleting setting:', err);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'string':
        return 'bg-blue-100 text-blue-800';
      case 'number':
        return 'bg-green-100 text-green-800';
      case 'boolean':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatValue = (value, type) => {
    if (!value) return 'N/A';
    
    switch (type) {
      case 'boolean':
        return value === 'true' ? 'True' : 'False';
      case 'number':
        return parseFloat(value).toLocaleString();
      default:
        return value;
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadSettings} />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage application settings and configurations</p>
          </div>
          <Button onClick={handleAddSetting} className="flex items-center space-x-2">
            <ApperIcon name="Plus" size={16} />
            <span>Add Setting</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search settings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Settings List */}
      {settings.length === 0 ? (
        <Empty
          title="No settings found"
          description={searchTerm || typeFilter ? "No settings match your search criteria" : "No settings have been created yet"}
          action={
            <Button onClick={handleAddSetting} variant="outline">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add First Setting
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4">
          {settings.map((setting) => (
            <Card key={setting.Id} className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {setting.Name}
                    </h3>
                    <Badge className={getTypeBadgeColor(setting.type_c)}>
                      {setting.type_c}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Value:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatValue(setting.value_c, setting.type_c)}
                      </span>
                    </div>
                    
                    {setting.description_c && (
                      <div className="flex items-start space-x-2">
                        <span className="text-sm text-gray-500 mt-0.5">Description:</span>
                        <span className="text-sm text-gray-700 flex-1">
                          {setting.description_c}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      {setting.CreatedOn && (
                        <span>Created: {new Date(setting.CreatedOn).toLocaleDateString()}</span>
                      )}
                      {setting.ModifiedOn && (
                        <span>Modified: {new Date(setting.ModifiedOn).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditSetting(setting)}
                    className="text-gray-600 hover:text-primary"
                  >
                    <ApperIcon name="Edit" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSetting(setting)}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingSetting ? 'Edit Setting' : 'Add New Setting'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <Input
                  name="Name"
                  value={formData.Name}
                  onChange={handleFormChange}
                  placeholder="Setting name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  name="type_c"
                  value={formData.type_c}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value *
                </label>
                {formData.type_c === 'boolean' ? (
                  <select
                    name="value_c"
                    value={formData.value_c}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Select value</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                ) : (
                  <Input
                    name="value_c"
                    type={formData.type_c === 'number' ? 'number' : 'text'}
                    value={formData.value_c}
                    onChange={handleFormChange}
                    placeholder={`Enter ${formData.type_c} value`}
                    required
                  />
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description_c"
                  value={formData.description_c}
                  onChange={handleFormChange}
                  placeholder="Setting description (optional)"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowAddForm(false)}
                  disabled={formLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center space-x-2"
                >
                  {formLoading && <ApperIcon name="Loader2" size={16} className="animate-spin" />}
                  <span>{editingSetting ? 'Update' : 'Create'} Setting</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;