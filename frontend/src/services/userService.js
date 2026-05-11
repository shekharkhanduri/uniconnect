import api from "./api";

/**
 * Get all users (for dashboard feed)
 * @returns {Promise} Array of users
 */
export const getAllUsers = async () => {
  try {
    const response = await api.get("/api/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise} User object
 */
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/api/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

/**
 * Get current logged-in user
 * @returns {Promise} Current user object
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get("/api/auth/current");
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {FormData|Object} data - User data to update
 * @returns {Promise} Updated user object
 */
export const updateUser = async (userId, data) => {
  try {
    const config = {};
    
    // Don't set Content-Type for FormData - browser will set it with boundary
    if (!(data instanceof FormData)) {
      config.headers = {
        "Content-Type": "application/json",
      };
    }
    
    const response = await api.patch(`/api/user/${userId}`, data, config);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

/**
 * Delete user account
 * @param {string} userId - User ID
 * @returns {Promise} Success message
 */
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/api/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

