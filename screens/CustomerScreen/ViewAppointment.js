import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useAppointment } from "../../hooks/useAppointment";

const statusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "#FFA500";
    case "completed":
      return "#4CAF50";
    default:
      return "#2196F3";
  }
};

const Tag = ({ color, children }) => (
  <View style={[styles.tag, { backgroundColor: color }]}>
    <Text style={styles.tagText}>{children}</Text>
  </View>
);

export default function ViewAppointment() {
  const { loading, appointment, getAppointments } = useAppointment();

  useEffect(() => {
    getAppointments({}).then((res) => {});
  }, []);

  const data = Array.isArray(appointment)
    ? appointment
    : appointment
      ? [appointment]
      : [];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>
        Dịch vụ: {item.service_id?.name || item.service_id || "N/A"}
      </Text>
      <Text>
        Ngày hẹn:{" "}
        {item.appointment_date
          ? new Date(item.appointment_date).toLocaleDateString()
          : ""}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text>Trạng thái: </Text>
        <Tag color={statusColor(item.status)}>{item.status}</Tag>
      </View>
      <Text>Loại lấy mẫu: {item.type}</Text>
      <Text>Địa chỉ lấy mẫu: {item.collection_address}</Text>
      <Text>
        Nhân viên phụ trách:{" "}
        {typeof item.staff_id === "object" && item.staff_id ? (
          `${item.staff_id.first_name || ""} ${item.staff_id.last_name || ""} – ${item.staff_id.email || ""}`
        ) : (
          <Tag color="#F44336">Chưa phân công</Tag>
        )}
      </Text>
      <Text>
        Kỹ thuật viên xét nghiệm:{" "}
        {typeof item.laboratory_technician_id === "object" &&
        item.laboratory_technician_id ? (
          `${item.laboratory_technician_id.first_name || ""} ${item.laboratory_technician_id.last_name || ""} – ${item.laboratory_technician_id.email || ""}`
        ) : (
          <Tag color="#F44336">Chưa phân công</Tag>
        )}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>Không có lịch hẹn nào</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 12 },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
  },
  title: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  tag: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 4,
    alignSelf: "flex-start",
  },
  tagText: { color: "#fff", fontWeight: "bold" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
