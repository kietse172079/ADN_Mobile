import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const createAppointment = createAsyncThunk(
  "appointment/createAppointment",
  async (payload, { rejectWithValue }) => {
    let token;
    try {
      token = await AsyncStorage.getItem("accessToken");
      console.log("Token retrieved in createAppointment:", token);
      if (!token) {
        throw new Error("No token, authorization denied.");
      }

      const response = await fetch(API.CREATE_APPOINTMENT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log("API Response:", data);
      if (!response.ok) {
        throw new Error(data.message || "Tạo lịch hẹn thất bại");
      }
      return data.data;
    } catch (error) {
      console.log("Create appointment error:", error.message);
      return rejectWithValue(error.message || "Network error");
    }
  }
);

const appointmentSlice = createSlice({
  name: "appointment",
  initialState: {
    loading: false,
    error: null,
    appointment: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointment = action.payload;
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default appointmentSlice;
