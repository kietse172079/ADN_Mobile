import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import usePayment from "../../../hooks/usePayment";

const PayOSMethodWebViewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { appointmentId } = route.params || {};

  const { makePayment, cancelPaymentRequest, isLoading, isCancelling, error } =
    usePayment();

  const [paymentUrl, setPaymentUrl] = useState("");
  const [showWebView, setShowWebView] = useState(false);
  const [paymentNo, setPaymentNo] = useState(null);

  useEffect(() => {
    if (!appointmentId) {
      Alert.alert("Lỗi", "Không tìm thấy mã lịch hẹn!");
      navigation.goBack();
      return;
    }

    const createPayment = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) {
          Alert.alert(
            "Lỗi",
            "Không tìm thấy token xác thực. Vui lòng đăng nhập lại!"
          );
          navigation.goBack();
          return;
        }

        const payload = {
          appointment_id: appointmentId,
          payment_method: "payos",
        };

        const res = await makePayment(payload);

        if (!res.success || !res.data.success) {
          const errorMessage = res.error
            ? typeof res.error === "string"
              ? res.error
              : JSON.stringify(res.error)
            : res.data.message
              ? typeof res.data.message === "string"
                ? res.data.message
                : JSON.stringify(res.data.message)
              : "Không thể tạo thanh toán";
          Alert.alert("Lỗi", errorMessage);
          return;
        }

        const paymentData = res.data.data;
        const url = paymentData.checkout_url;
        const paymentNo = paymentData.payment_no;
        if (paymentNo) {
          await AsyncStorage.setItem("payment_no", paymentNo);
          setPaymentNo(paymentNo); // Lưu paymentNo vào state
          // console.log("Stored paymentNo:", paymentNo); // Debug
        }

        if (url) {
          setPaymentUrl(url);
          setShowWebView(true);
        } else {
          Alert.alert("Lỗi", "Không tìm thấy đường dẫn thanh toán!");
        }
      } catch (err) {
        console.error("❌ Lỗi tạo thanh toán:", err);
        const errorMessage = err?.message
          ? typeof err.message === "string"
            ? err.message
            : JSON.stringify(err.message)
          : "Có lỗi xảy ra khi tạo thanh toán.";
        Alert.alert("Lỗi", errorMessage);
      }
    };

    createPayment();
  }, [appointmentId]);

  const handleCancelPayment = async () => {
    try {
      if (!paymentNo) {
        Alert.alert("Lỗi", "Không tìm thấy mã thanh toán để hủy.");
        return;
      }
      // console.log("Initiating cancel with paymentNo:", paymentNo); // Debug

      const result = await cancelPaymentRequest(paymentNo);
      // console.log("Cancel result:", result); // Debug kết quả

      if (result.success) {
        await AsyncStorage.removeItem("payment_no");
        setPaymentNo(null); // Xóa paymentNo khỏi state
        Alert.alert("Đã hủy", "Bạn đã hủy thanh toán thành công.", [
          {
            text: "OK",
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: "Trang chủ" }],
              });
            },
          },
        ]);
      } else {
        const errorMessage = result.error?.message
          ? typeof result.error.message === "string"
            ? result.error.message
            : JSON.stringify(result.error.message)
          : "Hủy thanh toán thất bại.";
        Alert.alert("Lỗi", errorMessage);
      }
    } catch (err) {
      // console.error("❌ Lỗi khi hủy thanh toán:", err);
      const errorMessage = err?.message
        ? typeof err.message === "string"
          ? err.message
          : JSON.stringify(err.message)
        : "Có lỗi xảy ra khi hủy thanh toán.";
      Alert.alert("Lỗi", errorMessage);
    }
  };

  const handleCancelRequest = () => {
    if (paymentNo) {
      Alert.alert(
        "Xác nhận hủy thanh toán",
        "Bạn có chắc chắn muốn hủy thanh toán này?",
        [
          {
            text: "Hủy bỏ",
            style: "cancel",
          },
          {
            text: "Xác nhận",
            onPress: handleCancelPayment,
          },
        ],
        { cancelable: true }
      );
    } else {
      Alert.alert("Lỗi", "Không có thông tin thanh toán để hủy.");
    }
  };

  const handleWebViewNavigation = async (navState) => {
    // console.log("Navigation state:", navState.url);
    if (navState.url.includes("success")) {
      setShowWebView(false);
      navigation.navigate("PayOSReturnScreen");
    }
  };

  return (
    <View style={styles.container}>
      {showWebView && paymentUrl ? (
        <View style={{ flex: 1 }}>
          <WebView
            source={{ uri: paymentUrl }}
            style={{ flex: 1 }}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              // console.log("WebView error:", nativeEvent);
              Alert.alert(
                "Lỗi",
                `Không thể tải trang: ${nativeEvent.description}`
              );
              setShowWebView(false);
            }}
            onNavigationStateChange={handleWebViewNavigation}
          />
          <View style={styles.cancelButtonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelRequest}
              disabled={isCancelling}
            >
              <Text style={styles.cancelButtonText}>
                {isCancelling ? "Đang hủy..." : "Hủy thanh toán"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.centered}>
          {isLoading || isCancelling ? (
            <>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text style={{ marginTop: 10 }}>
                {isCancelling
                  ? "Đang hủy thanh toán..."
                  : "Đang tạo thanh toán..."}
              </Text>
            </>
          ) : (
            <Text>Đang xử lý...</Text>
          )}
        </View>
      )}
      {error && (
        <Text style={styles.error}>
          {String(error.message || "Đã xảy ra lỗi")}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  cancelButtonContainer: {
    position: "absolute",
    bottom: 15,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ff4444",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    opacity: 1,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PayOSMethodWebViewScreen;
