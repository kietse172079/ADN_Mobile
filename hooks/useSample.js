import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addSamplesToAppointment,
  fetchSamplesByAppointment,
  uploadSamplePersonImage,
  batchSubmitSamples,
  fetchSampleById,
} from "../feartures/sample/sampleSlice";

const useSample = () => {
  const dispatch = useDispatch();
  const { samples, selectedSample, isLoading, isError, error } = useSelector(
    (state) => state.sample
  );

  const addSamples = async (payload) => {
    try {
      const res = await dispatch(addSamplesToAppointment(payload)).unwrap();
      return { success: true, data: res };
    } catch (error) {
      return { success: false, error: error?.message || error };
    }
  };

  const getSamplesByAppointment = useCallback(
    async (appointmentId) => {
      try {
        const res = await dispatch(
          fetchSamplesByAppointment(appointmentId)
        ).unwrap();
        return { success: true, data: res };
      } catch (error) {
        return { success: false, error: error?.message || error };
      }
    },
    [dispatch]
  );

  const uploadPersonImage = useCallback(
    async (sampleId, imageFile) => {
      try {
        const res = await dispatch(
          uploadSamplePersonImage({ sampleId, imageFile })
        ).unwrap();
        return { success: true, data: res };
      } catch (error) {
        return { success: false, error: error?.message || error };
      }
    },
    [dispatch]
  );

  const submitSamples = async (sample_ids, collection_date) => {
    try {
      const res = await dispatch(
        batchSubmitSamples({ sample_ids, collection_date })
      ).unwrap();
      return { success: true, data: res };
    } catch (error) {
      return { success: false, error: error?.message || error };
    }
  };

  const getSampleById = useCallback(
    async (sampleId) => {
      try {
        const res = await dispatch(fetchSampleById(sampleId)).unwrap();
        return { success: true, data: res };
      } catch (error) {
        return { success: false, error: error?.message || error };
      }
    },
    [dispatch]
  );

  return {
    // Actions
    addSamples,
    getSamplesByAppointment,
    uploadPersonImage,
    submitSamples,
    getSampleById,

    // State
    samples,
    selectedSample,
    loading: isLoading,
    error: isError ? error : null,
  };
};

export default useSample;
