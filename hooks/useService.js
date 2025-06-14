// src/features/service/useService.js
import { useDispatch, useSelector } from "react-redux";
import {
  fetchServiceById,
  fetchChildServices,
  fetchServices,
  clearSelectedService,
} from "../feartures/service/serviceSlice";
import { useCallback } from "react";

export const useService = () => {
  const dispatch = useDispatch();
  const { services, selectedService, childServices, loading, error } =
    useSelector((state) => state.service);

  const getAllServices = useCallback(() => {
    dispatch(fetchServices({ is_active: true }));
  }, [dispatch]);

  const filterServices = useCallback(
    (type) => {
      dispatch(fetchServices({ is_active: true, type }));
    },
    [dispatch]
  );

  const getServiceById = (id) => dispatch(fetchServiceById(id));
  const getChildServices = (id) => dispatch(fetchChildServices(id));

  
  const getServices = useCallback(
    (searchPayload) => {
      dispatch(fetchServices(searchPayload));
    },
    [dispatch]
  );
  const resetSelectedService = () => dispatch(clearSelectedService());

  return {
    services,
    selectedService,
    childServices,
    loading,
    error,
    getServiceById,
    getChildServices,
    getServices,
    getAllServices,
    filterServices,
    resetSelectedService,
  };
};
