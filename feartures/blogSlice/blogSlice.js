// store/blog/blogSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../../services/apiConfig";

// Search blogs
export const searchBlogs = createAsyncThunk(
  "blog/searchBlogs",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(API.SEARCH_BLOGS, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get blog by slug
export const getBlogBySlug = createAsyncThunk(
  "blog/getBlogBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const res = await axios.get(API.GET_BLOG_BY_SLUG(slug));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogs: [],
    total: 0,
    blogDetail: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchBlogs.fulfilled, (state, action) => {
        state.blogs = action.payload.data.pageData;
        state.total = action.payload.data.pageInfo?.totalItems || 0;
        state.loading = false;
      })
      .addCase(searchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getBlogBySlug.fulfilled, (state, action) => {
        state.blogDetail = action.payload.data;
      });
  },
});

export default blogSlice;
