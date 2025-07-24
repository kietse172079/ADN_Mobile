import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Alert, ScrollView } from "react-native";
import { Button, RadioButton, ActivityIndicator } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import useSample from "../../hooks/useSample";
import usePayment from "../../hooks/usePayment";
import { useAppointment } from "../../hooks/useAppointment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview";

const PaymentSampleScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { appointmentId, sampleIds } = route.params || {};
  const { getSamplesByAppointment } = useSample();
  const { getAppointmentDetail } = useAppointment();
  const { makePayment, isLoading: paying, error } = usePayment();
  const [samples, setSamples] = useState([]);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState("cash");
  const [showWebView, setShowWebView] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");

  const translateStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "sample_received":
        return "Mẫu đã nhận";
      default:
        return status || "Không rõ";
    }
  };

  useEffect(() => {
    console.log("appointmentId:", appointmentId);
    if (!appointmentId) {
      setTimeout(() => navigation.goBack(), 0);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [appRes, sampleRes] = await Promise.all([
          getAppointmentDetail(appointmentId),
          getSamplesByAppointment(appointmentId),
        ]);
        console.log("appRes", appRes);
        if (appRes.success) setAppointment(appRes.data);
        if (sampleRes.success)
          setSamples(
            Array.isArray(sampleRes.data.data) ? sampleRes.data.data : []
          );
      } catch (err) {
        Alert.alert("Error", "Failed to load data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appointmentId]);

  const handlePayment = async () => {
    const payload = {
      appointment_id: appointmentId,
      payment_method: method,
      sample_ids: sampleIds,
    };

    console.log("🔹 Payload gửi thanh toán:", payload);

    try {
      const res = await makePayment(payload);
      console.log("🔸 Kết quả từ makePayment:", res);

      if (!res.success || !res.data.success) {
        Alert.alert(
          "Error",
          "Lỗi thanh toán: " +
            (res.error || res.data.message || "Unknown error")
        );
        return;
      }

      const paymentData = res.data.data;
      const url = paymentData.checkout_url;
      const paymentNo = paymentData.payment_no;

      console.log("🔸 Dữ liệu thanh toán:", paymentData);
      console.log("🔸 URL thanh toán:", url);
      console.log("🔸 payment_no:", paymentNo);

      if (method === "pay_os" && url) {
        if (paymentNo) {
          await AsyncStorage.setItem("payment_no", paymentNo);
        }
        // Hiển thị WebView thay vì mở trình duyệt
        setPaymentUrl(url);
        setShowWebView(true);
      } else {
        Alert.alert("Success", "Thanh toán tiền mặt thành công!");
        navigation.goBack();
      }
    } catch (err) {
      console.error("❌ Lỗi trong handlePayment:", err);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi xử lý thanh toán.");
    }
  };

  const getSlotTime = (slot) => {
    if (!slot?.time_slots?.length) return "--";
    const t = slot.time_slots[0];
    return `${t.day}/${t.month}/${t.year} (${t.start_time.hour}:${t.start_time.minute} - ${t.end_time.hour}:${t.end_time.minute})`;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00a9a4" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Thanh toán lịch hẹn</Text>

        {/* Appointment Info */}
        <View style={styles.section}>
          {/* Service Info */}
          <View style={styles.card}>
            <Image
              source={{ uri: appointment?.service_id?.image_url }}
              style={styles.serviceImageLarge}
              resizeMode="cover"
            />
            <Text style={styles.serviceTitle}>
              {appointment?.service_id?.name}
            </Text>
          </View>

          {/* User Info */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Thông tin người đặt</Text>
            <View style={styles.row}>
              {appointment?.user_id?.avatar && (
                <Image
                  source={{ uri: appointment.user_id.avatar }}
                  style={styles.avatarLarge}
                />
              )}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.boldText}>
                  Tên:
                  {appointment?.user_id?.last_name}{" "}
                  {appointment?.user_id?.first_name}
                </Text>
                <Text>Email: {appointment?.user_id?.email}</Text>
                <Text>SĐT: {appointment?.user_id?.phone_number}</Text>
              </View>
            </View>
          </View>

          {/* Appointment Detail */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Thông tin lịch hẹn</Text>
            <Text style={styles.detailItem}>
              <Text style={styles.label}>Mã lịch hẹn: </Text>
              <Text style={styles.mono}>{appointment?._id}</Text>
            </Text>
            <Text style={styles.detailItem}>
              <Text style={styles.label}>Địa chỉ lấy mẫu: </Text>
              {appointment?.collection_address}
            </Text>
            <Text style={styles.detailItem}>
              <Text style={styles.label}>Ngày hẹn: </Text>
              {appointment?.appointment_date
                ? new Date(appointment.appointment_date).toLocaleString()
                : "--"}
            </Text>
            <Text style={styles.detailItem}>
              <Text style={styles.label}>Khung giờ: </Text>
              {appointment?.slot_id?.time_slots?.length > 0
                ? getSlotTime(appointment?.slot_id)
                : "Chưa đăng ký"}
            </Text>

            <Text style={styles.detailItem}>
              <Text style={styles.label}>Nhân viên: </Text>
              {appointment?.staff_id?.first_name ||
              appointment?.staff_id?.last_name
                ? `${appointment?.staff_id?.last_name || ""} ${appointment?.staff_id?.first_name || ""}`
                : "Chưa đăng ký"}
            </Text>

            <Text style={styles.detailItem}>
              <Text style={styles.label}>Kỹ thuật viên: </Text>
              {appointment?.laboratory_technician_id?.first_name ||
              appointment?.laboratory_technician_id?.last_name
                ? `${appointment?.laboratory_technician_id?.last_name || ""} ${appointment?.laboratory_technician_id?.first_name || ""}`
                : "Chưa đăng ký"}
            </Text>
          </View>

          {/* Status */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Trạng thái</Text>
            <Text style={styles.detailItem}>
              <Text style={styles.label}>Lịch hẹn: </Text>
              <Text style={styles.statusText}>
                {translateStatus(appointment?.status)}
              </Text>
            </Text>
            <Text style={styles.detailItem}>
              <Text style={styles.label}>Thanh toán: </Text>
              <Text style={styles.statusText}>
                {appointment?.payment_status === "paid"
                  ? "Đã thanh toán"
                  : "Chưa thanh toán"}
              </Text>
            </Text>
          </View>
        </View>

        {/* Sample List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danh sách mẫu:</Text>
          {samples.map((s) => (
            <View key={s._id} style={styles.sampleCard}>
              <View style={styles.sampleHeader}>
                {s.person_info?.image_url && (
                  <Image
                    source={{ uri: s.person_info.image_url }}
                    style={styles.sampleImage}
                    resizeMode="cover"
                  />
                )}
                <View>
                  <Text style={styles.sampleName}>{s.person_info?.name}</Text>
                  <Text style={styles.sampleDetail}>
                    Loại mẫu: {s.type} | Quan hệ: {s.person_info?.relationship}
                  </Text>
                  <Text style={styles.sampleStatus}>
                    Trạng thái: {s.status}
                  </Text>
                </View>
              </View>
              <View style={styles.sampleGrid}>
                <Text style={styles.sampleItem}>
                  <Text style={styles.label}>Kit code: </Text>
                  {s.kit_id?.code}
                </Text>
                <Text style={styles.sampleItem}>
                  <Text style={styles.label}>Kit status: </Text>
                  {s.kit_id?.status}
                </Text>
                <Text style={styles.sampleItem}>
                  <Text style={styles.label}>Ngày sinh: </Text>
                  {s.person_info?.dob
                    ? new Date(s.person_info.dob).toLocaleDateString()
                    : "--"}
                </Text>
                <Text style={styles.sampleItem}>
                  <Text style={styles.label}>Nơi sinh: </Text>
                  {s.person_info?.birth_place}
                </Text>
                <Text style={styles.sampleItem}>
                  <Text style={styles.label}>Quốc tịch: </Text>
                  {s.person_info?.nationality}
                </Text>
                <Text style={styles.sampleItem}>
                  <Text style={styles.label}>CMND/CCCD: </Text>
                  {s.person_info?.identity_document}
                </Text>
                <Text style={styles.sampleItem}>
                  <Text style={styles.label}>Ngày lấy mẫu: </Text>
                  {s.collection_date
                    ? new Date(s.collection_date).toLocaleString()
                    : "--"}
                </Text>
                <Text style={styles.sampleItem}>
                  <Text style={styles.label}>Ngày nhận mẫu: </Text>
                  {s.received_date
                    ? new Date(s.received_date).toLocaleString()
                    : "--"}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Payment Section */}
        <View style={styles.paymentSection}>
          <View style={styles.totalRow}>
            <Text style={styles.sectionTitle}>Tổng tiền:</Text>
            <Text style={styles.totalAmount}>
              {appointment?.service_id?.price?.toLocaleString()} đ
            </Text>
          </View>
          <Text style={styles.sectionTitle}>Chọn phương thức thanh toán:</Text>
          <RadioButton.Group onValueChange={setMethod} value={method}>
            <View style={styles.radioRow}>
              <RadioButton value="cash" color="#00a9a4" />
              <Text style={styles.radioLabel}>💵 Tiền mặt</Text>
            </View>
            <View style={styles.radioRow}>
              <RadioButton value="pay_os" color="#00a9a4" />
              <Text style={styles.radioLabel}>🌐 PAY_OS</Text>
            </View>
          </RadioButton.Group>

          {showWebView ? (
            <WebView
              source={{ uri: paymentUrl }}
              style={{ flex: 1, height: 900 }}
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
            <Button
              mode="contained"
              onPress={handlePayment}
              loading={paying}
              disabled={paying}
              style={styles.payButton}
              labelStyle={styles.payButtonLabel}
            >
              {paying ? "Đang xử lý..." : "Xác nhận thanh toán"}
            </Button>
          )}

          {error && (
            <Text style={styles.errorText}>
              {error.message || "Đã xảy ra lỗi"}
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 16,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  serviceImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  details: {
    flex: 1,
    marginHorizontal: 8,
  },
  detailItem: {
    fontSize: 16,
    marginBottom: 4,
  },
  label: {
    fontWeight: "bold",
  },
  mono: {
    fontFamily: "monospace",
  },
  bold: {
    fontWeight: "bold",
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userDetail: {
    fontSize: 14,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sampleCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },

  serviceImageLarge: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 8,
  },

  serviceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#00a9a4",
  },

  avatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusText: {
    fontWeight: "bold",
    color: "#00a9a4",
  },

  sampleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sampleImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
  },
  sampleName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  sampleDetail: {
    fontSize: 14,
    color: "#666",
  },
  sampleStatus: {
    fontSize: 12,
    color: "#888",
  },
  sampleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  sampleItem: {
    width: "50%",
    fontSize: 14,
    marginBottom: 4,
  },
  paymentSection: {
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00a9a4",
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  radioLabel: {
    fontSize: 16,
  },
  payButton: {
    marginTop: 16,
    backgroundColor: "#00a9a4",
    borderRadius: 8,
  },
  payButtonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  errorText: {
    color: "#F44336",
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PaymentSampleScreen;
