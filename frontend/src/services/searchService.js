import api from './api';

// Search users by name
export const searchUsers = async (query) => {
  try {
    const response = await api.get('/api/search/users', {
      params: { query }
    });
    return response.data;
  } catch (error) {
    console.error('Search users error:', error);
    throw error.response?.data || error;
  }
};

// Search users by skill
export const searchBySkill = async (skill) => {
  try {
    const response = await api.get('/api/search/skills', {
      params: { skill }
    });
    return response.data;
  } catch (error) {
    console.error('Search by skill error:', error);
    throw error.response?.data || error;
  }
};

// Search users by course
export const searchByCourse = async (course) => {
  try {
    const response = await api.get('/api/search/course', {
      params: { course }
    });
    return response.data;
  } catch (error) {
    console.error('Search by course error:', error);
    throw error.response?.data || error;
  }
};

// Combined search (searches all fields)
export const searchAll = async (query) => {
  try {
    // Call all three APIs in parallel
    const [nameResults, skillResults, courseResults] = await Promise.allSettled([
      searchUsers(query),
      searchBySkill(query),
      searchByCourse(query)
    ]);

    // Extract successful results
    const allUsers = [];
    
    if (nameResults.status === 'fulfilled') {
      allUsers.push(...nameResults.value.users);
    }
    if (skillResults.status === 'fulfilled') {
      allUsers.push(...skillResults.value.users);
    }
    if (courseResults.status === 'fulfilled') {
      allUsers.push(...courseResults.value.users);
    }

    // Remove duplicates based on _id
    const uniqueUsers = Array.from(
      new Map(allUsers.map(user => [user._id, user])).values()
    );

    return {
      success: true,
      count: uniqueUsers.length,
      users: uniqueUsers
    };
  } catch (error) {
    console.error('Search all error:', error);
    throw error;
  }
};