import { useDispatch, useSelector } from "react-redux";
import {
  fetchCities,
  fetchWards,
  clearWards,
} from "../feartures/address/addressSlice";
import { useEffect } from "react";

const useAddress = () => {
  const dispatch = useDispatch();
  const { cities, wards, loading } = useSelector((state) => state.address);

  const getCities = () => {
    dispatch(fetchCities());
  };

  const getWards = (districtCode) => {
    dispatch(fetchWards(districtCode));
  };

  const resetWards = () => {
    dispatch(clearWards());
  };

  return {
    cities,
    wards,
    loading,
    getCities,
    getWards,
    resetWards,
  };
};

export default useAddress;
