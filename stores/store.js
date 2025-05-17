import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../feartures/user/authSlice";

export const store = configureStore({
    reducer: {
        // Add your reducers here
        auth: authSlice.reducer,
    },
    
})