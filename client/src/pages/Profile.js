import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiCamera,
  FiSave,
  FiEdit,
  FiLock,
  FiShield,
  FiBell,
  FiGlobe
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm();

  useEffect(() => {
    if (user) {
      setValue('name', user.name || '');
      setValue('email', user.email || '');
      setValue('phone', user.phone || '');
      setValue('location', user.location || '');
      setValue('bio', user.bio || '');
    }
  }, [user, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedData = {
        ...data,
        profileImage: profileImage
      };
      
      await updateProfile(updatedData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = () => {
    toast.success('Password change functionality will be implemented');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="text-center">
                {/* Profile Image */}
                <div className="relative inline-block mb-4">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white text-4xl font-bold">
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Profile" 
                        className="h-32 w-32 rounded-full object-cover"
                      />
                    ) : (
                      user?.name?.charAt(0)?.toUpperCase() || 'U'
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                      <FiCamera className="h-5 w-5 text-gray-600" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-1">{user?.name}</h2>
                <p className="text-gray-600 mb-2 capitalize">{user?.role}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>

                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 flex items-center justify-center w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
                  >
                    <FiEdit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        {...register('name', { required: 'Name is required' })}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiPhone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        {...register('phone')}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        {...register('location')}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    {...register('bio')}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {isEditing && (
                  <div className="mt-6 flex space-x-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50"
                    >
                      <FiSave className="h-4 w-4 mr-2" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setProfileImage(null);
                        setPreviewImage(null);
                      }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Account Settings */}
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FiLock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-900">Change Password</h4>
                      <p className="text-sm text-gray-500">Update your account password</p>
                    </div>
                  </div>
                  <button
                    onClick={handlePasswordChange}
                    className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Change
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FiShield className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500">Add an extra layer of security</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-gray-400 font-medium cursor-not-allowed">
                    Coming Soon
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FiBell className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-900">Notification Preferences</h4>
                      <p className="text-sm text-gray-500">Manage your notification settings</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-gray-400 font-medium cursor-not-allowed">
                    Coming Soon
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <FiGlobe className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-900">Language & Region</h4>
                      <p className="text-sm text-gray-500">Set your preferred language and timezone</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-gray-400 font-medium cursor-not-allowed">
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
