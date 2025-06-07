import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../services/apiClient";
import API from "../services/apiConfig";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const token = useSelector((state) => state.auth.token);

  const fetchUserData = async () => {
    try {
      let accessToken = token;
      if (!accessToken) {
        accessToken = await AsyncStorage.getItem("accessToken");
      }
      if (!accessToken) {
        setIsLoading(false);
        return;
      }
      const response = await apiClient.get(API.LOGIN, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUser(response.data.data || response.data.user || response.data);
    } catch (error) {
      console.error("Error fetch data user", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [token]);

  return {
    userId: user?._id,
    avatar: user?.avatar_url,
    firstName: user?.first_name,
    lastName: user?.last_name,
    address: user?.address,
    dob: user?.dob,
    phoneNumber: user?.phone_number,
    role: user?.role,
    email: user?.email,
    user,
    isLoading,
    refreshUserData: fetchUserData,
  };
};

export default useAuth;
