import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  token: null,
  avatar: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.token = action.payload.token;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
    },
    setUser(state, action) {
      state.user = action.payload.user;
    },
    updateAvatar(state, action) {
      state.avatar = action.payload;
    },
  },
});

export const { login, logout, updateAvatar, setUser } = authSlice.actions;
export default authSlice;
