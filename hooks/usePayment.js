import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react"; // Chỉ sử dụng useCallback, loại bỏ use và useEffect không cần thiết
import {
  createPaymentIntent,
  verifyPayment,
} from "../feartures/payment/paymentSlice";

const usePayment = () => {
  const dispatch = useDispatch();
  const { paymentIntent, verificationResult, isLoading, isVerifying, error } =
    useSelector((state) => state.payment);

  const makePayment = useCallback(
    async ({ appointment_id, payment_method, sample_ids }) => {
      try {
        const res = await dispatch(
          createPaymentIntent({ appointment_id, payment_method, sample_ids })
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

  return {
    makePayment,
    verifyPaymentStatus,
    paymentIntent,
    verificationResult,
    isLoading,
    isVerifying,
    error,
  };
};

export default usePayment;
