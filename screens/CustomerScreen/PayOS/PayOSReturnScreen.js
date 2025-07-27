import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import usePayment from "../../../hooks/usePayment";
import { useNavigation } from "@react-navigation/native";

const PayOSReturnScreen = () => {
  const navigation = useNavigation();
  const [countdown, setCountdown] = useState(5);
  const [isVerified, setIsVerified] = useState(false);

  const { verifyPaymentStatus, isVerifying } = usePayment();

  useEffect(() => {
    let isMounted = true;
    let timerId = null;

    const verify = async () => {
      try {
        const paymentNo = await AsyncStorage.getItem("payment_no");

        if (!paymentNo) {
          Alert.alert("Lỗi", "Không tìm thấy mã thanh toán.");
          if (isMounted) {
            navigation.reset({
              index: 0,
              routes: [{ name: "Trang chủ" }],
            });
          }
          return;
        }

        const result = await verifyPaymentStatus(paymentNo);

        if (result.success) {
          await AsyncStorage.removeItem("payment_no");
          if (isMounted) setIsVerified(true);

          timerId = setInterval(() => {
            setCountdown((c) => {
              if (c <= 1) {
                clearInterval(timerId);
                if (isMounted) {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Trang chủ" }],
                  });
                }
              }
              return c - 1;
            });
          }, 1000);
        } else {
          Alert.alert(
            "Lỗi xác minh",
            result.error?.message || "Không xác định"
          );
          if (isMounted) navigation.navigate("Trang chủ");
        }
      } catch (err) {
        Alert.alert("Lỗi", "Xác minh thanh toán thất bại.");
        if (isMounted) navigation.navigate("Trang chủ");
      }
    };

    verify();

    return () => {
      isMounted = false;
      if (timerId) clearInterval(timerId);
    };
  }, []);

  if (isVerifying) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00a9a4" />
        <Text style={styles.verifyingText}>Đang xác minh thanh toán...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.successText}>🎉 Thanh toán thành công!</Text>
      <Text style={styles.countdownText}>
        Bạn sẽ được chuyển về trang chủ sau {countdown} giây.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Trang chủ" }],
          });
        }}
      >
        <Text style={styles.buttonText}>Về ngay</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PayOSReturnScreen;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  verifyingText: {
    marginTop: 16,
    fontSize: 18,
    color: "#555",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 20,
  },
  successText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#059669",
    marginBottom: 16,
    textAlign: "center",
  },
  countdownText: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
    color: "#374151",
  },
  button: {
    backgroundColor: "#00a9a4",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
