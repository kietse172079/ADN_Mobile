import { useDispatch, useSelector } from "react-redux";
import { createAppointment } from "../feartures/appointment/appointmentSlice";
import { useCallback } from "react";

export const useAppointment = () => {
  const dispatch = useDispatch();
  const { loading, error, appointment } = useSelector(
    (state) => state.appointment
  );

  const bookAppointment = useCallback(
    async (payload) => {
      console.log("Dispatching appointment with payload:", payload);
      const result = await dispatch(createAppointment(payload)).unwrap();
      console.log("Appointment result after unwrap:", result);
      return result;
    },
    [dispatch]
  );

  return {
    loading,
    error,
    appointment,
    bookAppointment,
  };
};
