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

export const registerUser = async (userData) => {
  const formData = new FormData();
  formData.append("address", JSON.stringify(userData.address));

  Object.entries(userData).forEach(([key, value]) => {
    if (key !== "address" && value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  try {
    const response = await apiClient.post(API.REGISTER, formData);

    // console.log("📥 Phản hồi đăng ký:", response.status, response.data);

    return response; // Trả về cho component xử lý
  } catch (error) {
    // console.log("📛 Lỗi đăng ký:", error?.response?.data);
    throw (
      error?.response?.data?.Errors ||
      error?.response?.data?.Message ||
      error?.message ||
      "Đăng ký thất bại"
    );
  }
};
