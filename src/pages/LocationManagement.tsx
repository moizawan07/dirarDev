import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { locationsService, usersService } from '../services/dataService';
import type { Location } from '../types';
import { Trash2, Edit, Plus } from 'lucide-react';

const LocationManagement: React.FC = () => {
  const { getUserRole, user } = useAuth();
  const [locations, setLocations] = useState<Location[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    user: '',
    assigned_location: '',
    branch: '',
  });

  const userRole = getUserRole();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const locationsData = await locationsService.getAll();
      const usersData = await usersService.getAll();

      let filteredLocations = locationsData;
      let filteredUsers = usersData;

      if (userRole === 'admin') {
        // Admin can only manage accountants in their branch
        filteredLocations = locationsData.filter((l) => l.branch === user?.branch);
        filteredUsers = usersData.filter(
          (u) => u.role === 'accountant' && u.branch === user?.branch
        );
      } else if (userRole === 'super_admin') {
        // Super admin can manage all
        filteredUsers = usersData.filter((u) => u.role === 'admin' || u.role === 'accountant');
      }

      setLocations(filteredLocations);
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (location?: Location) => {
    if (location) {
      setEditingLocation(location);
      setFormData({
        user: location.user,
        assigned_location: location.assigned_location,
        branch: location.branch,
      });
    } else {
      setEditingLocation(null);
      setFormData({
        user: '',
        assigned_location: '',
        branch: user?.branch || '',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Location submitted:', formData);
    setShowModal(false);
    loadData();
  };

  const handleDelete = (locationId: string) => {
    if (window.confirm('Are you sure you want to delete this location assignment?')) {
      console.log('Deleting location:', locationId);
      loadData();
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading locations...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Location Management</h1>
          <p className="text-gray-600 mt-1">
            {userRole === 'admin'
              ? 'Assign locations to Accountants'
              : 'Assign locations to Admins & Accountants'}
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          <span>Assign Location</span>
        </button>
      </div>

      {/* Locations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">User</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                  Assigned Location
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Branch</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                  User Email
                </th>
                <th className="text-center py-3 px-6 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location) => (
                <tr key={location.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-6 text-sm font-medium text-gray-900">
                    {users.find((u) => u.email === location.user)?.name || location.user}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-600">{location.assigned_location}</td>
                  <td className="py-3 px-6 text-sm text-gray-600">{location.branch}</td>
                  <td className="py-3 px-6 text-sm text-gray-600">{location.user}</td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => handleOpenModal(location)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(location.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {editingLocation ? 'Edit Location Assignment' : 'Assign Location'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                  <select
                    value={formData.user}
                    onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a user</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.email}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.assigned_location}
                    onChange={(e) =>
                      setFormData({ ...formData, assigned_location: e.target.value })
                    }
                    placeholder="e.g., Downtown, Uptown"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={userRole === 'admin'}
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                  >
                    {editingLocation ? 'Update' : 'Assign'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationManagement;
