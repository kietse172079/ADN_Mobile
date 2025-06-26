import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchAvailableSlots = createAsyncThunk(
  "slot/fetchAvailableSlots",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = Object.entries(params)
        .filter(([key, value]) => value !== undefined)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");
      const url = queryString
        ? `${API.FETCH_AVAILABLE_SLOTS}?${queryString}`
        : API.FETCH_AVAILABLE_SLOTS;
      const token = await AsyncStorage.getItem("accessToken");
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      // console.log("Full API response:", data); // Debug response
      const allSlots =
        data.data?.pageData?.flatMap(
          (slot) =>
            slot.time_slots.map((timeSlot) => ({
              id: slot._id?.$oid || slot._id, 
              time_id: timeSlot._id?.$oid || timeSlot._id, 
              start_time: new Date(
                timeSlot.year,
                timeSlot.month - 1,
                timeSlot.day,
                timeSlot.start_time.hour,
                timeSlot.start_time.minute
              ).toISOString(),
              end_time: new Date(
                timeSlot.year,
                timeSlot.month - 1,
                timeSlot.day,
                timeSlot.end_time.hour,
                timeSlot.end_time.minute
              ).toISOString(),
              staff: slot.staff_profile_ids.find(
                (staff) => staff?.$oid === timeSlot.staff_id
              ) || { user_id: { first_name: "N/A" } },
            })) || []
        ) || [];
      // console.log("Mapped slots:", allSlots); // Debug slots
      if (allSlots.length === 0) {
        // console.log("No slots mapped, checking data structure:", data.data);
      }
      return allSlots;
    } catch (error) {
      console.log("Fetch slots error:", error.message);
      return rejectWithValue(error.message || "Network error");
    }
  }
);

const slotSlice = createSlice({
  name: "slot",
  initialState: {
    slots: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.slots = action.payload;
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default slotSlice;
