import { useDispatch, useSelector } from "react-redux";
import { fetchAvailableSlots } from "../feartures/slot/slotSlice"; 
import { useCallback } from "react";

export const useSlot = () => {
  const dispatch = useDispatch();
  const { slots, loading, error } = useSelector((state) => state.slot);

  const getAvailableSlots = useCallback(
    (params) => {
      // console.log("Fetching slots with params:", params); // Debug
      return dispatch(fetchAvailableSlots(params));
    },
    [dispatch]
  );

  return {
    slots,
    loading,
    error,
    getAvailableSlots,
  };
};