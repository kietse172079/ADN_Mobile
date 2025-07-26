import apiClient from "./apiClient";
import API from "./apiConfig";

export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post(API.LOGIN, { email, password });
    // console.log("Login response:", response.data);
    return response.data;
  } catch (error) {
    // console.error("Error logging in:", error);
    throw error;
  }
};

export const loginWithGoogle = async (google_id) => {
  try {
    const response = await apiClient.post(API.LOGIN_GOOGLE, { google_id });
    console.log("Login with Google response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error logging in with Google:", error);
    throw error;
  }
};
