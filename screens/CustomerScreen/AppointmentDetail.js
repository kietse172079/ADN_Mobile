import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import useSample from "../../hooks/useSample";
import ModalApplyKit from "./ModalApplyKit";

const statusColor = (status) => {
  switch ((status || "").toLowerCase()) {
    case "pending":
      return "#FFA500";
    case "confirmed":
      return "#2196F3";
    case "completed":
      return "#4CAF50";
    case "cancelled":
      return "#F44336";
    case "sample_collected":
      return "#9907FA";
    case "sample_received":
      return "#FA07B9";
    case "sample_assigned":
      return "#078dfaff";
    default:
      return "#00a9a4";
  }
};

const translateStatus = (status) => {
  switch ((status || "").toLowerCase()) {
    case "pending":
      return "Chờ xác nhận";
    case "confirmed":
      return "Đã xác nhận";
    case "completed":
      return "Hoàn thành";
    case "cancelled":
      return "Đã hủy";
    case "sample_collected":
      return "Đã lấy mẫu";
    case "sample_received":
      return "Đã nhận mẫu";
    case "sample_assigned":
      return "Đã phân công mẫu";
    default:
      return status || "Không rõ";
  }
};

const typeColor = (type) => {
  switch ((type || "").toLowerCase()) {
    case "self":
      return "#3ea900ff";
    case "home":
      return "#2196F3";
    case "facility":
      return "#2BEAED";
    default:
      return "#9E9E9E";
  }
};

const paymentColor = (status) => {
  switch ((status || "").toLowerCase()) {
    case "paid":
      return "#1291e6ff";
    case "unpaid":
      return "#F44336";
    default:
      return "#9E9E9E";
  }
};

const StatusBadge = ({ status }) => (
  <View style={[styles.badge, { backgroundColor: statusColor(status) }]}>
    <Text style={styles.badgeText}>{translateStatus(status)}</Text>
  </View>
);

const TypeBadge = ({ type }) => (
  <View style={[styles.badge, { backgroundColor: typeColor(type) }]}>
    <Text style={styles.badgeText}>
      {type === "self"
        ? "Tự gửi mẫu"
        : type === "home"
          ? "Lấy mẫu tại nhà"
          : type === "facility"
            ? "Lấy mẫu tại cơ sở"
            : type}
    </Text>
  </View>
);

const PaymentBadge = ({ status }) => (
  <View style={[styles.badge, { backgroundColor: paymentColor(status) }]}>
    <Text style={styles.badgeText}>
      {status === "paid"
        ? "Đã thanh toán"
        : status === "unpaid"
          ? "Chưa thanh toán"
          : status}
    </Text>
  </View>
);

export default function AppointmentDetail({ route }) {
  const { appointment } = route.params;
  const navigation = useNavigation();
  const { addSamples, getSamplesByAppointment } = useSample();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Xử lý yêu cầu bộ dụng cụ
  const handleRequestKit = async () => {
    setLoading(true);
    try {
      const payload = {
        appointment_id: appointment._id,
        sample_types: ["blood"],
        notes: "",
        person_info_list: [
          {
            name: "Default Name",
            dob: "",
            relationship: "",
            birth_place: "",
            nationality: "",
            identity_document: "",
          },
        ],
      };
      const res = await addSamples(payload);
      if (res.success) {
        Alert.alert("Thành công", "Yêu cầu bộ dụng cụ thành công!");
        setModalVisible(false);
      } else {
        Alert.alert("Lỗi", res.error || "Yêu cầu bộ dụng cụ thất bại");
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message || "Yêu cầu bộ dụng cụ thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xem mẫu
  const handleViewSamples = async () => {
    setLoading(true);
    try {
      const res = await getSamplesByAppointment(appointment._id);
      if (res.success) {
        navigation.navigate("ViewSampleAppointment", {
          appointmentId: appointment._id,
          samples: res.data,
        });
      } else {
        Alert.alert("Lỗi", res.error || "Không thể tải danh sách mẫu");
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message || "Không thể tải danh sách mẫu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.header}>Chi tiết lịch hẹn</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Dịch vụ:</Text>
          <Text style={styles.value}>
            {appointment.service_id?.name || appointment.service_id || "N/A"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Ngày hẹn:</Text>
          <Text style={styles.value}>
            {appointment.appointment_date
              ? new Date(appointment.appointment_date).toLocaleString()
              : ""}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Trạng thái:</Text>
          <StatusBadge status={appointment.status} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Loại lấy mẫu:</Text>
          <TypeBadge type={appointment.type} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Địa chỉ lấy mẫu:</Text>
          <Text style={styles.value}>
            {appointment.collection_address || "N/A"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Thanh toán:</Text>
          <PaymentBadge status={appointment.payment_status} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Nhân viên phụ trách:</Text>
          <Text style={styles.value}>
            {appointment.staff_id?.first_name
              ? `${appointment.staff_id.first_name} ${appointment.staff_id.last_name}`
              : appointment.staff_id || "Chưa phân công"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Kỹ thuật viên xét nghiệm:</Text>
          <Text style={styles.value}>
            {appointment.laboratory_technician_id?.first_name
              ? `${appointment.laboratory_technician_id.first_name} ${appointment.laboratory_technician_id.last_name}`
              : appointment.laboratory_technician_id || "Chưa phân công"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Mã hồ sơ hành chính:</Text>
          <Text style={styles.value}>
            {appointment.administrative_case_id || "N/A"}
          </Text>
        </View>

        {/* Nút hành động */}
        <View style={styles.buttonContainer}>
          {["self", "home"].includes(
            (appointment.type || "").toLowerCase()
          ) && (
            <Button
              mode="contained"
              onPress={() => setModalVisible(true)}
              loading={loading}
              disabled={loading || appointment.status === "completed"}
              style={[styles.button, { backgroundColor: "#00a9a4" }]}
              labelStyle={{ color: "#fff", fontWeight: "bold" }}
            >
              Nhận bộ dụng cụ
            </Button>
          )}

          <Button
            mode="outlined"
            onPress={handleViewSamples}
            loading={loading}
            disabled={loading || !appointment._id}
            style={[styles.button, { borderColor: "#00a9a4" }]}
            labelStyle={{ color: "#00a9a4", fontWeight: "bold" }}
          >
            Xem Mẫu
          </Button>
        </View>
      </View>

      {/* ModalApplyKit */}
      <ModalApplyKit
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        appointmentId={appointment._id}
        onSubmit={handleRequestKit}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#e6f7f7",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: "#00a9a4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00a9a4",
    marginBottom: 18,
    alignSelf: "center",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  label: {
    fontWeight: "bold",
    color: "#00a9a4",
    minWidth: 130,
    fontSize: 15,
  },
  value: {
    flex: 1,
    fontSize: 15,
    color: "#222",
    marginLeft: 4,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginLeft: 4,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
    letterSpacing: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});
