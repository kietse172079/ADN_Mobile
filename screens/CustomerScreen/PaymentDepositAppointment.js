import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import usePayment from "../../hooks/usePayment";

const PaymentDepositAppointment = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { appointmentId } = route.params || {}; // lấy id được truyền từ trang trước

  const { makePayment, isLoading, error } = usePayment();

  const [paymentUrl, setPaymentUrl] = useState("");
  const [showWebView, setShowWebView] = useState(false);

  useEffect(() => {
    if (!appointmentId) {
      Alert.alert("Lỗi", "Không tìm thấy mã lịch hẹn!");
      navigation.goBack();
      return;
    }

    const createPayment = async () => {
      try {
        const payload = {
          appointment_id: appointmentId,
          payment_method: "pay_os",
        };

        const res = await makePayment(payload);

        if (!res.success || !res.data.success) {
          Alert.alert(
            "Lỗi",
            res.error || res.data.message || "Không thể tạo thanh toán"
          );
          return;
        }

        const paymentData = res.data.data;
        const url = paymentData.checkout_url;
        const paymentNo = paymentData.payment_no;

        if (paymentNo) {
          await AsyncStorage.setItem("payment_no", paymentNo);
        }

        if (url) {
          setPaymentUrl(url);
          setShowWebView(true);
        } else {
          Alert.alert("Lỗi", "Không tìm thấy đường dẫn thanh toán!");
        }
      } catch (err) {
        console.error("❌ Lỗi tạo thanh toán:", err);
        Alert.alert("Lỗi", "Có lỗi xảy ra khi tạo thanh toán.");
      }
    };

    createPayment();
  }, [appointmentId]);

  return (
    <View style={styles.container}>
      {showWebView && paymentUrl ? (
        <WebView
          source={{ uri: paymentUrl }}
          style={{ flex: 1 }}
          onNavigationStateChange={(navState) => {
            if (navState.url.includes("success")) {
              setShowWebView(false);
              navigation.navigate("PayOSReturnScreen");
            } else if (navState.url.includes("cancel")) {
              setShowWebView(false);
              Alert.alert("Cancelled", "Thanh toán đã bị hủy.");
            }
          }}
        />
      ) : (
        <View style={styles.centered}>
          <Text>Đang tạo thanh toán...</Text>
        </View>
      )}
      {error && (
        <Text style={styles.error}>{error.message || "Đã xảy ra lỗi"}</Text>
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
});

export default PaymentDepositAppointment;
