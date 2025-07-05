import React from "react";
import { View, Text, StyleSheet } from "react-native";

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
    default:
      return status || "Không rõ";
  }
};

const StatusBadge = ({ status }) => (
  <View style={[styles.badge, { backgroundColor: statusColor(status) }]}>
    <Text style={styles.badgeText}>{translateStatus(status)}</Text>
  </View>
);

export default function AppointmentDetail({ route }) {
  const { appointment } = route.params;

  return (
    <View style={styles.screen}>
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
          <Text style={styles.value}>{appointment.type}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Địa chỉ lấy mẫu:</Text>
          <Text style={styles.value}>
            {appointment.collection_address || "N/A"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Thanh toán:</Text>
          <Text style={styles.value}>{appointment.payment_status}</Text>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#e6f7f7",
    padding: 16,
    justifyContent: "center",
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
});
