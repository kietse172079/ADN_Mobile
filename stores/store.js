import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../feartures/user/authSlice";
import serviceSlice from "../feartures/service/serviceSlice";
import appointmentSlice from "../feartures/appointment/appointmentSlice";
import slotSlice from "../feartures/slot/slotSlice";

export const store = configureStore({
    reducer: {
        // Add your reducers here
        auth: authSlice.reducer,
        service: serviceSlice.reducer,
        appointment: appointmentSlice.reducer,
        slot: slotSlice.reducer,
    },
    
})