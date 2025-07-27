import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://provinces.open-api.vn/api";

// Fetch all cities with districts (depth=2)
export const fetchCities = createAsyncThunk("address/fetchCities", async () => {
  const res = await axios.get(`${BASE_URL}/?depth=2`);
  return res.data;
});

// Fetch wards of a district (for dynamic ward list)
export const fetchWards = createAsyncThunk(
  "address/fetchWards",
  async (districtCode) => {
    const res = await axios.get(`${BASE_URL}/d/${districtCode}?depth=2`);
    return res.data.wards;
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    cities: [],
    wards: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWards: (state) => {
      state.wards = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.cities = action.payload;
        state.loading = false;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchWards.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWards.fulfilled, (state, action) => {
        state.wards = action.payload;
        state.loading = false;
      })
      .addCase(fetchWards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearWards } = addressSlice.actions;
export default addressSlice;
