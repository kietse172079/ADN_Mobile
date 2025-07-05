import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useAppointment } from "../../hooks/useAppointment";
import { useNavigation } from "@react-navigation/native";

const PAGE_SIZE = 10;

/* ---------- Helpers ---------- */
const statusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "#FFA500"; // cam
    case "confirmed":
      return "#2196F3"; // xanh dương
    case "completed":
      return "#4CAF50"; // xanh lá
    case "cancelled":
      return "#F44336"; // đỏ
    case "sample_collected":
      return "#9907FA"; // tim
    case "sample_received":
      return "#FA07B9"; // hồng
    case "testing":
      return "#5ED3EB"; // xanh nhạt
    default:
      return "#9E9E9E"; // xám
  }
};

const translateStatus = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "Chờ xác nhận";
    case "confirmed":
      return "Đã xác nhận";
    case "completed":
      return "Hoàn thành";
    case "cancelled":
      return "Đã hủy";
    case "sample_collected":
      return "Đã Lấy mẫu";
    case "sample_received":
      return "Đã nhận mẫu";
    case "testing":
      return "Đang xét nghiệm";
    default:
      return status || "Không rõ";
  }
};

const formatDate = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const Tag = ({ color, children }) => (
  <View style={[styles.tag, { backgroundColor: color }]}>
    <Text style={styles.tagText}>{children}</Text>
  </View>
);

/* ---------- Component ---------- */
export default function ViewAppointment() {
  const { loading, getAppointments } = useAppointment();
  const navigation = useNavigation();

  const [appointments, setAppointments] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadAppointments = async (page = 1) => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const res = await getAppointments({ pageNum: page, pageSize: PAGE_SIZE });
      const items = res?.data?.pageData || [];
      const totalPages = res?.data?.pageInfo?.totalPages || 1;

      setAppointments((prev) => {
        const merged = [...prev, ...items];
        const uniqueMap = new Map();
        merged.forEach((item) => uniqueMap.set(item._id, item));
        const unique = Array.from(uniqueMap.values());
        console.log(
          "📦 Items:",
          unique.map((a) => a._id)
        );
        return unique;
      });

      setHasMore(page < totalPages);
      setPageNum(page + 1);
    } catch (err) {
      console.error("❌ Load appointments error:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadAppointments(1);
  }, []);

  /* ---------- Render ---------- */
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("AppointmentDetail", { appointment: item })
      }
    >
      <View style={styles.card}>
        <Text style={styles.title}>
          Dịch vụ: {item.service_id?.name || item.service_id || "N/A"}
        </Text>
        <Text>Ngày hẹn: {formatDate(item.appointment_date)}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text>Trạng thái: </Text>
          <Tag color={statusColor(item.status)}>
            {translateStatus(item.status)}
          </Tag>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () =>
    isLoadingMore ? (
      <View style={{ padding: 12 }}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    ) : null;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách đặt lịch</Text>
      {loading && appointments.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item, index) =>
            item._id?.toString() || `index-${index}`
          }
          renderItem={renderItem}
          ListEmptyComponent={<Text>Không có lịch hẹn nào</Text>}
          ListFooterComponent={renderFooter}
          onEndReached={() => loadAppointments(pageNum)}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 12, paddingTop: 32 },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#00a9a4",
    alignSelf: "center",
  },
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
