import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const createAppointment = createAsyncThunk(
  "appointment/createAppointment",
  async (payload, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
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

export const fetchAppointments = createAsyncThunk(
  "appointment/fetchAppointments",
  async (params, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const url = `${API.FETCH_APPOINTMENT}?${new URLSearchParams(params).toString()}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Lỗi khi lấy danh sách lịch hẹn");
      }
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

const appointmentSlice = createSlice({
  name: "appointment",
  initialState: {
    loading: false,
    error: null,
    appointment: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.appointment.push(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointment = action.payload.pageData || [];
      });
  },
});

export default appointmentSlice;
