import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../feartures/user/authSlice";
import serviceSlice from "../feartures/service/serviceSlice";

export const store = configureStore({
    reducer: {
        // Add your reducers here
        auth: authSlice.reducer,
        service: serviceSlice.reducer,
    },
    
})