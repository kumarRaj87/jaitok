import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X, Camera, Upload, Save } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

function EditProfileModal({ isOpen, onClose, profile, fetchProfile }) {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    website: "",
    avatar: "",
    location: "",
  });

  const [initialData, setInitialData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (profile) {
      const initialProfileData = {
        username: profile.username || "",
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        bio: profile.bio || "",
        website: profile.website || "",
        avatar: profile.avatar || "",
        location: profile.location || "",
      };
      setFormData(initialProfileData);
      setInitialData(initialProfileData);
      setCharCount(initialProfileData.bio.length);
    }
  }, [profile]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds the maximum limit of 5MB");
      return;
    }

    setFormData((prev) => ({ ...prev, avatar: file }));
  };


  const handleBioChange = (e) => {
    const text = e.target.value;
    setCharCount(text.length);
    setFormData({ ...formData, bio: text });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = "Username is required.";
    }

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required.";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required.";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      errors.email = "Invalid email format.";
    }

    if (formData.bio && formData.bio.length > 80) {
      errors.bio = "Bio cannot exceed 80 characters.";
    }

    return errors;
  };

  const authToken = localStorage.getItem("authToken");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    const payload = new FormData();
    payload.append("username", formData.username);
    payload.append("firstName", formData.firstName);
    payload.append("lastName", formData.lastName);
    payload.append("email", formData.email);
    payload.append("bio", formData.bio);
    payload.append("website", formData.website);
    payload.append("location", formData.location);

    // Append avatar only if it's a new file
    if (formData.avatar instanceof File) {
      payload.append("avatar", formData.avatar);
    }

    setIsSubmitting(true);

    try {
      // Send PATCH request to update profile
      const response = await axios.patch(
        "https://jaitok-api.jaitia.com/accounts/users/profile",
        payload,
        {
          headers: {
            "content-language": "english",
            "Content-Type": "multipart/form-data",
            accept: "application/json",
            "access-token": authToken,
          },
        }
      );

      // Check if the request was successful
      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        fetchProfile()
        onClose();
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An error occurred while updating the profile."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine if any changes have been made
  const hasChanges = () => {
    return Object.keys(formData).some(key => formData[key] !== initialData[key]);
  };


  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-0 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6">
                  <div className="flex items-center justify-between">
                    <Dialog.Title as="h3" className="text-lg font-bold text-white">
                      Edit Your Profile
                    </Dialog.Title>
                    <button
                      onClick={onClose}
                      className="text-white/80 hover:text-white transition"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Avatar Upload */}
                  <div className="mt-6 flex flex-col items-center">
                    <div className="relative group">
                      {formData.avatar ? (
                        <img
                          src={formData.avatar}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-pink-600 to-rose-700 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                          {formData.firstName.charAt(0).toUpperCase() || formData.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                        id="avatarInput"
                      />
                      <label
                        htmlFor="avatarInput"
                        className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200"
                      >
                        <Camera className="w-8 h-8 text-white" />
                      </label>
                    </div>
                    <p className="text-white text-sm mt-2">
                      <label htmlFor="avatarInput" className="cursor-pointer hover:underline">
                        Change photo
                      </label>
                    </p>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b">
                  <button
                    className={`flex-1 py-3 font-medium text-sm ${activeTab === "personal"
                      ? "text-rose-500 border-b-2 border-rose-500"
                      : "text-gray-500 hover:text-gray-700"
                      }`}
                    onClick={() => setActiveTab("personal")}
                  >
                    Personal Info
                  </button>
                  <button
                    className={`flex-1 py-3 font-medium text-sm ${activeTab === "additional"
                      ? "text-rose-500 border-b-2 border-rose-500"
                      : "text-gray-500 hover:text-gray-700"
                      }`}
                    onClick={() => setActiveTab("additional")}
                  >
                    Additional Info
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                  {activeTab === "personal" && (
                    <div className="space-y-4">
                      {/* Username */}
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Username
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.username}
                            onChange={(e) =>
                              setFormData({ ...formData, username: e.target.value })
                            }
                            className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                            placeholder="Your username"
                          />
                        </div>
                      </div>

                      {/* First Name and Last Name */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) =>
                              setFormData({ ...formData, firstName: e.target.value })
                            }
                            className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                            placeholder="First name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) =>
                              setFormData({ ...formData, lastName: e.target.value })
                            }
                            className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                            placeholder="Last name"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === "additional" && (
                    <div className="space-y-4">
                      {/* Website */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Website
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">https://</span>
                          </div>
                          <input
                            type="text"
                            value={formData.website.replace('https://', '')}
                            onChange={(e) =>
                              setFormData({ ...formData, website: `https://${e.target.value.replace('https://', '')}` })
                            }
                            className="block w-full pl-16 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                            placeholder="example.com"
                          />
                        </div>
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({ ...formData, location: e.target.value })
                          }
                          className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                          placeholder="City, Country"
                        />
                      </div>

                      {/* Bio */}
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Bio
                          </label>
                          <span className={`text-xs ${charCount > 70 ? (charCount > 80 ? 'text-red-500' : 'text-amber-500') : 'text-gray-500'}`}>
                            {charCount}/80
                          </span>
                        </div>
                        <textarea
                          value={formData.bio}
                          onChange={handleBioChange}
                          rows={3}
                          className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 resize-none"
                          placeholder="Tell the world about yourself"
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons - Fixed at bottom */}
                  <div className="mt-6 flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !hasChanges()}
                      className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-rose-500 rounded-lg shadow-sm hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors ${isSubmitting || !hasChanges() ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default EditProfileModal;