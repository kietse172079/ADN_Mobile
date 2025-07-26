import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react"; // Chỉ sử dụng useCallback, loại bỏ use và useEffect không cần thiết
import {
  createPaymentIntent,
  verifyPayment,
  cancelPayment,
} from "../feartures/payment/paymentSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const usePayment = () => {
  const dispatch = useDispatch();
  const {
    paymentIntent,
    verificationResult,
    isLoading,
    isVerifying,
    isCancelling,
    error,
  } = useSelector((state) => state.payment);

  // const makePayment = useCallback(
  //   async ({ appointment_id, payment_method, sample_ids }) => {
  //     try {
  //       const res = await dispatch(
  //         createPaymentIntent({ appointment_id, payment_method, sample_ids })
  //       ).unwrap();
  //       return { success: true, data: res };
  //     } catch (err) {
  //       return { success: false, error: err };
  //     }
  //   },
  //   [dispatch]
  // );

  const makePayment = useCallback(
    async ({ appointment_id, payment_method }) => {
      try {
        const res = await dispatch(
          createPaymentIntent({ appointment_id, payment_method })
        ).unwrap();
        return { success: true, data: res };
      } catch (err) {
        return { success: false, error: err };
      }
    },
    [dispatch]
  );

  const verifyPaymentStatus = useCallback(
    async (paymentNo) => {
      try {
        const res = await dispatch(verifyPayment(paymentNo)).unwrap();
        return { success: true, data: res };
      } catch (err) {
        return { success: false, error: err };
      }
    },
    [dispatch]
  );

  const cancelPaymentRequest = useCallback(
    async (paymentNo) => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No token found. Please log in again.");
        }
        console.log("Token for cancel request:", token); // Debug
        const res = await dispatch(cancelPayment(paymentNo)).unwrap();
        return { success: true, data: res };
      } catch (err) {
        return { success: false, error: err.message || err };
      }
    },
    [dispatch]
  );

  return {
    makePayment,
    verifyPaymentStatus,
    cancelPaymentRequest,
    paymentIntent,
    verificationResult,
    isLoading,
    isVerifying,
    isCancelling,
    error,
  };
};

export default usePayment;
