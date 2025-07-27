import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  fetchResultsByAppointment,
  fetchResultById,
  fetchResultBySample,
  resetResultState,
} from "../feartures/result/resultSlice";

const useResult = () => {
  const dispatch = useDispatch();
  const { resultsByAppointment, resultById, resultBySample, isLoading, error } =
    useSelector((state) => state.result);

  const getResultsByAppointment = useCallback(
    async (appointmentId) => {
      try {
        const res = await dispatch(
          fetchResultsByAppointment(appointmentId)
        ).unwrap();
        return { success: true, data: res };
      } catch (err) {
        return { success: false, error: err };
      }
    },
    [dispatch]
  );

  const getResultById = useCallback(
    async (resultId) => {
      try {
        const res = await dispatch(fetchResultById(resultId)).unwrap();
        return { success: true, data: res };
      } catch (err) {
        return { success: false, error: err };
      }
    },
    [dispatch]
  );

  const getResultBySample = useCallback(
    async (sampleId) => {
      try {
        const res = await dispatch(fetchResultBySample(sampleId)).unwrap();
        return { success: true, data: res };
      } catch (err) {
        return { success: false, error: err };
      }
    },
    [dispatch]
  );

  const resetResult = useCallback(() => {
    dispatch(resetResultState());
  }, [dispatch]);

  return {
    getResultsByAppointment,
    getResultById,
    getResultBySample,
    resetResult,
    resultsByAppointment,
    resultById,
    resultBySample,
    isLoading,
    error,
  };
};

export default useResult;
