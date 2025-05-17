import apiClient from "./apiClient";
import API from "./apiConfig";

export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post(API.LOGIN, { email, password });
    console.log("Login response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};
