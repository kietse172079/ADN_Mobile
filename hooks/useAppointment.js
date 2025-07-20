import { useDispatch, useSelector } from "react-redux";
import {
  createAppointment,
  fetchAppointments,
  getAppointmentById,
} from "../feartures/appointment/appointmentSlice";
import { useCallback } from "react";

export const useAppointment = () => {
  const dispatch = useDispatch();
  const { loading, error, appointment } = useSelector(
    (state) => state.appointment
  );

  const bookAppointment = useCallback(
    async (payload) => {
      // console.log("Dispatching appointment with payload:", payload);
      const result = await dispatch(createAppointment(payload)).unwrap();
      // console.log("Appointment result after unwrap:", result);
      return result;
    },
    [dispatch]
  );

  const getAppointments = async (params) => {
    try {
      const result = await dispatch(fetchAppointments(params)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error?.message || error };
    }
  };

  const getAppointmentDetail = async (id) => {
    try {
      const result = await dispatch(getAppointmentById(id)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error?.message || error };
    }
  };

  return {
    loading,
    error,
    appointment,
    bookAppointment,
    getAppointments,
    getAppointmentDetail,
  };
};
