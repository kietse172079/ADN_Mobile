import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchServiceById } from "../../feartures/service/serviceSlice";

export default function DetailService({ route, navigation }) {
  const { serviceId } = route.params;
  const dispatch = useDispatch();
  const { selectedService, loading } = useSelector((state) => state.service);

  useEffect(() => {
    dispatch(fetchServiceById(serviceId));
  }, [dispatch, serviceId]);

  if (loading || !selectedService) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00a9a4" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Hình ảnh dịch vụ */}
      <Image
        source={
          selectedService.image_url
            ? { uri: selectedService.image_url }
            : require("../../assets/DNA.jpg")
        }
        style={styles.image}
        resizeMode="contain"
      />
      {/* Tiêu đề dịch vụ */}
      <Text style={styles.title}>{selectedService.name}</Text>

      {/* Chi tiết dịch vụ */}
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Mô tả:</Text>
        <Text style={styles.desc}>{selectedService.description}</Text>
        <Text style={styles.label}>Loại dịch vụ:</Text>
        <Text style={styles.value}>
          {selectedService.type === "civil" ? "Dân sự" : "Hành chính"}
        </Text>
        <Text style={styles.label}>Thời gian ước tính:</Text>
        <Text style={styles.value}>{selectedService.estimated_time} giờ</Text>
        <Text style={styles.label}>Phương pháp lấy mẫu:</Text>
        <Text style={styles.value}>
          {selectedService.sample_method === "home_collected"
            ? "Lấy mẫu tại nhà"
            : selectedService.sample_method === "facility_collected"
              ? "Lấy mẫu tại cơ sở"
              : "Tự lấy mẫu"}
        </Text>
        <Text style={styles.label}>Giá dịch vụ:</Text>
        <Text style={styles.price}>
          {selectedService.price?.toLocaleString("vi-VN")}đ
        </Text>
      </View>
      {/* Nút đặt lịch hoặc liên hệ */}
      <TouchableOpacity
        style={styles.bookButton}
        onPress={() =>
          navigation.navigate("CreateAppointmentCivil", {
            serviceId: selectedService._id,
          })
        }
      >
        <Text style={styles.bookButtonText}>Đặt lịch ngay</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#fff",
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: Dimensions.get("window").width * 0.7,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00a9a4",
    textAlign: "center",
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00a9a4",
  },
  detailsContainer: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  desc: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
    marginBottom: 15,
  },
  bookButton: {
    backgroundColor: "#00a9a4",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
