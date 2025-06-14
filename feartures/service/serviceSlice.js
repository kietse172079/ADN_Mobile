import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/apiConfig";

export const fetchServiceById = createAsyncThunk(
  "service/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API.SERVICE}/${id}`);
      if (!response.ok) throw new Error("Failed to fetch service");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchChildServices = createAsyncThunk(
  "service/fetchChildServices",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API.SERVICE}/${id}/child`);
      if (!response.ok) throw new Error("Failed to fetch child services");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchServices = createAsyncThunk(
  "service/fetchServices",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = Object.entries(params)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");
      const url = queryString
        ? `${API.FETCH_SERVICES}?${queryString}`
        : API.FETCH_SERVICES;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      return data.data.pageData;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);
const serviceSlice = createSlice({
  name: "service",
  initialState: {
    services: [],
    selectedService: null,
    childServices: [],
    loading: false,
    error: null,
    activeCategory: null,
  },
  reducers: {
    clearSelectedService: (state) => {
      state.selectedService = null;
    },
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedService = action.payload;
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchChildServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChildServices.fulfilled, (state, action) => {
        state.loading = false;
        state.childServices = action.payload;
      })
      .addCase(fetchChildServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
        // state.total = action.payload.pageInfo.totalItems;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lỗi khi tải dịch vụ";
      });
  },
});

export const { clearSelectedService, setActiveCategory } = serviceSlice.actions;
export default serviceSlice;
