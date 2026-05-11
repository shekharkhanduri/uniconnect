import axios from "axios";
import { BASEURL } from "./api";

export async function login(email, password) {
  try {
    const response = await axios.post(`${BASEURL}/api/auth/login`, {
      email,
      password
    });
    
    console.log("User ID:", response.data.user._id);
    
    // Store the token if your API returns one
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      // or sessionStorage.setItem('token', response.data.token);
    }
    
    return response.data; // Return just the data, not the whole response
  } catch (error) {
    console.error("Login error:", error);
    
    // Extract error message from backend response
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.message || "Login failed. Please check your credentials and try again.";
      throw new Error(errorMessage);
    } else if (error.request) {
      // Request made but no response
      throw new Error("Unable to connect to server. Please check your internet connection and try again.");
    } else {
      // Something else happened
      throw new Error("Something went wrong. Please try again later.");
    }
  }
}

export async function register(data) {
  try {
    // If your API uses a different endpoint or expects different fields, update this path/shape.
    const response = await axios.post(`${BASEURL}/api/auth/register`, data);
    console.log(response.data.user?._id);
    
    // Store token if returned
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data; // return just the data
  } catch (error) {
    console.error("Register error:", error);
    if (error.response) {
      // Extract error message from backend response object
      const errorMessage = error.response.data?.message || "Registration failed. Please try again.";
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error("Unable to connect to server. Please check your internet connection and try again.");
    } else {
      throw new Error("Something went wrong. Please try again later.");
    }
  }
}
