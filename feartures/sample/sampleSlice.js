import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../services/apiConfig";

export const addSamplesToAppointment = createAsyncThunk(
  "sample/addSamplesToAppointment",
  async (payload, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await fetch(API.ADD_SAMPLES_TO_APPOINTMENT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        // Log lỗi chi tiết từ backend
        console.log("API trả về lỗi:", data);
        throw new Error(data.message || "Something went wrong!");
      }
      return data;
    } catch (error) {
      // Log lỗi chi tiết
      console.log("Lỗi khi gọi API:", error);
      return rejectWithValue(error.message || "Something went wrong!");
    }
  }
);

export const fetchSamplesByAppointment = createAsyncThunk(
  "sample/fetchSamplesByAppointment",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await fetch(
        API.FETCH_SAMPLES_BY_APPOINTMENT(appointmentId),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Lỗi khi lấy mẫu");
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

export const batchSubmitSamples = createAsyncThunk(
  "sample/batchSubmitSamples",
  async ({ sample_ids, collection_date }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await fetch(API.BATCH_SUBMIT_SAMPLES, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sample_ids, collection_date }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Lỗi khi nộp mẫu");
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

export const uploadSamplePersonImage = createAsyncThunk(
  "sample/uploadSamplePersonImage",
  async ({ sampleId, imageFile }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("sample_id", sampleId);
      formData.append("image", {
        uri: imageFile.uri,
        name: imageFile.fileName || "photo.jpg",
        type: imageFile.type || "image/jpeg",
      });

      const response = await fetch(API.UPLOAD_SAMPLE_PERSON_IMAGE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Lỗi khi upload ảnh");
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

export const fetchSampleById = createAsyncThunk(
  "sample/fetchSampleById",
  async (sampleId, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await fetch(API.FETCH_SAMPLE_BY_ID(sampleId), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Lỗi khi lấy mẫu");
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

const sampleSlice = createSlice({
  name: "sample",
  initialState: {
    samples: [],
    selectedSample: null,
    isLoading: false,
    isError: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addSamplesToAppointment.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(addSamplesToAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.samples = action.payload.data || action.payload; // lấy data nếu có
      })
      .addCase(addSamplesToAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(fetchSamplesByAppointment.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchSamplesByAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.samples = action.payload.data;
      })
      .addCase(fetchSamplesByAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(batchSubmitSamples.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(batchSubmitSamples.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.samples = action.payload;
      })
      .addCase(batchSubmitSamples.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(uploadSamplePersonImage.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(uploadSamplePersonImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.selectedSample = action.payload;
      })
      .addCase(uploadSamplePersonImage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(fetchSampleById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchSampleById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.selectedSample = action.payload.data;
      })
      .addCase(fetchSampleById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      });
  },
});

export default sampleSlice;
