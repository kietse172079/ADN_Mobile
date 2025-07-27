import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../services/apiConfig";

// Cập nhật thông tin người dùng theo ID
export const updateUserById = createAsyncThunk(
  "user/updateUserById",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await axios.put(API.UPDATE_USER_BY_ID(id), updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Đổi mật khẩu người dùng
export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await axios.put(API.CHANGE_PASSWORD, passwordData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  updatedUser: null,
  changePasswordResult: null,
  isUpdating: false,
  isChangingPassword: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUserState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Update user
      .addCase(updateUserById.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateUserById.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.updatedUser = action.payload;
      })
      .addCase(updateUserById.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })

      // Change password
      .addCase(changePassword.pending, (state) => {
        state.isChangingPassword = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isChangingPassword = false;
        state.changePasswordResult = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isChangingPassword = false;
        state.error = action.payload;
      });
  },
});

export const { resetUserState } = userSlice.actions;
export default userSlice;
