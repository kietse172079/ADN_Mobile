import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../services/apiConfig";

// Fetch results by appointment ID
export const fetchResultsByAppointment = createAsyncThunk(
  "result/fetchResultsByAppointment",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await axios.get(API.FETCH_RESULTS_BY_APPOINTMENT(appointmentId), {
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

// Fetch result by result ID
export const fetchResultById = createAsyncThunk(
  "result/fetchResultById",
  async (resultId, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await axios.get(API.FETCH_RESULT_BY_ID(resultId), {
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

// Fetch result by sample ID
export const fetchResultBySample = createAsyncThunk(
  "result/fetchResultBySample",
  async (sampleId, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await axios.get(API.FETCH_RESULT_BY_SAMPLE(sampleId), {
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

const resultSlice = createSlice({
  name: "result",
  initialState: {
    resultsByAppointment: [],
    resultById: null,
    resultBySample: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    resetResultState: (state) => {
      state.resultsByAppointment = [];
      state.resultById = null;
      state.resultBySample = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch by appointment
      .addCase(fetchResultsByAppointment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResultsByAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resultsByAppointment = action.payload;
      })
      .addCase(fetchResultsByAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch by result ID
      .addCase(fetchResultById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResultById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resultById = action.payload;
      })
      .addCase(fetchResultById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch by sample
      .addCase(fetchResultBySample.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResultBySample.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resultBySample = action.payload;
      })
      .addCase(fetchResultBySample.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetResultState } = resultSlice.actions;

export default resultSlice;
