import api from "./api";

/**
 * Send connection request to a user
 * @param {string} userId - User ID to send request to
 * @returns {Promise} Connection object
 */
export const sendConnectionRequest = async (userId) => {
  try {
    const response = await api.post(`/api/connections/send/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error sending connection request:", error);
    throw error;
  }
};

/**
 * Accept a connection request
 * @param {string} connectionId - Connection ID to accept
 * @returns {Promise} Connection object
 */
export const acceptConnectionRequest = async (connectionId) => {
  try {
    const response = await api.put(`/api/connections/accept/${connectionId}`);
    return response.data;
  } catch (error) {
    console.error("Error accepting connection request:", error);
    throw error;
  }
};

/**
 * Reject a connection request
 * @param {string} connectionId - Connection ID to reject
 * @returns {Promise} Success message
 */
export const rejectConnectionRequest = async (connectionId) => {
  try {
    const response = await api.put(`/api/connections/reject/${connectionId}`);
    return response.data;
  } catch (error) {
    console.error("Error rejecting connection request:", error);
    throw error;
  }
};

/**
 * Get all my connections (accepted)
 * @returns {Promise} Array of connections
 */
export const getMyConnections = async () => {
  try {
    const response = await api.get("/api/connections/my-connections");
    return response.data;
  } catch (error) {
    console.error("Error fetching connections:", error);
    throw error;
  }
};

/**
 * Get pending connection requests (received)
 * @returns {Promise} Array of pending requests
 */
export const getPendingRequests = async () => {
  try {
    const response = await api.get("/api/connections/pending");
    return response.data;
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    throw error;
  }
};

/**
 * Get sent connection requests
 * @returns {Promise} Array of sent requests
 */
export const getSentRequests = async () => {
  try {
    const response = await api.get("/api/connections/sent");
    return response.data;
  } catch (error) {
    console.error("Error fetching sent requests:", error);
    throw error;
  }
};

/**
 * Remove/unfriend a connection
 * @param {string} userId - User ID to remove connection with
 * @returns {Promise} Success message
 */
export const removeConnection = async (userId) => {
  try {
    const response = await api.delete(`/api/connections/remove/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error removing connection:", error);
    throw error;
  }
};

/**
 * Check connection status with a specific user
 * @param {string} userId - User ID to check status with
 * @returns {Promise} Connection status object
 */
export const getConnectionStatus = async (userId) => {
  try {
    const response = await api.get(`/api/connections/status/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error checking connection status:", error);
    throw error;
  }
};

