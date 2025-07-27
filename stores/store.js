import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../feartures/user/authSlice";
import serviceSlice from "../feartures/service/serviceSlice";
import appointmentSlice from "../feartures/appointment/appointmentSlice";
import slotSlice from "../feartures/slot/slotSlice";
import sampleSlice from "../feartures/sample/sampleSlice";
import paymentSlice from "../feartures/payment/paymentSlice";
import blogSlice from "../feartures/blogSlice/blogSlice";
import resultSlice from "../feartures/result/resultSlice";
import userSlice from "../feartures/user/userSlice";

export const store = configureStore({
  reducer: {
    // Add your reducers here
    auth: authSlice.reducer,
    service: serviceSlice.reducer,
    appointment: appointmentSlice.reducer,
    slot: slotSlice.reducer,
    sample: sampleSlice.reducer,
    payment: paymentSlice.reducer,
    blog: blogSlice.reducer,
    result: resultSlice.reducer,
    user: userSlice.reducer,
  },
});
