import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "../../feartures/service/serviceSlice";
import { theme } from "../../theme/theme";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function HomeScreen({ navigation }) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const { services, loading, error } = useSelector((state) => state.service);
  const [selectedType, setSelectedType] = useState("civil");

  // Lọc dịch vụ theo loại đã chọn
  const filteredServices = selectedType
    ? services.filter((item) => item.type === selectedType)
    : services;

  useEffect(() => {
    dispatch(
      fetchServices({
        pageNum: 1,
        pageSize: 10,
        is_active: true,
        sort_by: "created_at",
        sort_order: "desc",
      })
    );
  }, [dispatch]);

  const mainFeatures = [
    { id: "1", title: "Lịch hẹn" },
    { id: "2", title: "Liên hệ" },
    { id: "3", title: "Cộng đồng hỏi đáp" },
    { id: "4", title: "Cẩm nang" },
  ];

  return (
    <View style={styles.container}>
      {/* Banner quảng cáo */}
      <Image
        source={require("../../assets/DNA.jpg")}
        style={styles.banner}
        resizeMode="cover"
      />

      {/* Chức năng chính */}
      <View style={styles.mainFeaturesWrapper}>
        <FlatList
          data={mainFeatures}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.featureCard}>
              <Ionicons
                name={
                  item.title === "Lịch hẹn"
                    ? "calendar"
                    : item.title === "Liên hệ"
                      ? "call"
                      : item.title === "Cộng đồng hỏi đáp"
                        ? "chatbox"
                        : "medkit"
                }
                size={30}
                color="#000"
                style={styles.featureIcon}
              />
              <Text style={styles.featureText}>{item.title}</Text>
            </View>
          )}
          style={styles.featuresContainer}
        />
      </View>
      {/* Dịch vụ mới */}
      <Text style={styles.sectionTitle}>Dịch vụ</Text>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedType === "" && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedType("")}
        >
          <Text
            style={[
              styles.filterText,
              selectedType === "" && styles.filterTextActive,
            ]}
          >
            Tất cả dịch vụ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedType === "civil" && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedType("civil")}
        >
          <Text
            style={[
              styles.filterText,
              selectedType === "civil" && styles.filterTextActive,
            ]}
          >
            Dân sự
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedType === "administrative" && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedType("administrative")}
        >
          <Text
            style={[
              styles.filterText,
              selectedType === "administrative" && styles.filterTextActive,
            ]}
          >
            Hành chính
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item._id?.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.serviceCard}
            onPress={() =>
              navigation.navigate("DetailService", { serviceId: item._id })
            }
          >
            <Image
              source={
                item.image_url
                  ? { uri: item.image_url }
                  : require("../../assets/DNA.jpg")
              }
              style={styles.serviceImage}
            />
            <View style={styles.serviceTextContainer}>
              <Text style={styles.serviceTitle}>{item.name}</Text>
              {/* <Text style={styles.serviceSubtitle}>{item.description}</Text> */}
              <Text style={styles.servicePrice}>
                Giá: {item.price?.toLocaleString("vi-VN")}đ
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          loading ? (
            <Text>Đang tải dịch vụ...</Text>
          ) : (
            <Text>Không có dịch vụ nào</Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.medium,
  },
  banner: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: theme.spacing.medium,
  },
  downloadButton: {
    backgroundColor: "#FFD700",
    padding: theme.spacing.small,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: -40,
    zIndex: 1,
  },
  downloadText: {
    color: "#000",
    fontWeight: "bold",
  },
  featuresContainer: {
    marginVertical: theme.spacing.medium,
  },
  featureCard: {
    backgroundColor: "#E0F7FA",
    padding: theme.spacing.medium,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: theme.spacing.small,
    width: 80,
  },
  featureIcon: {
    width: 30,
    height: 30,
    marginBottom: theme.spacing.small,
  },
  featureText: {
    fontSize: 12,
    color: theme.colors.text,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.small,
  },
  servicesContainer: {
    marginBottom: theme.spacing.medium,
  },
  serviceCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.small,
    alignItems: "center",
  },
  serviceImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: theme.spacing.medium,
  },
  serviceTextContainer: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  serviceSubtitle: {
    fontSize: 12,
    color: "#666",
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginTop: theme.spacing.small,
  },
  arrowIcon: {
    width: 20,
    height: 20,
  },
  healthCheckCard: {
    backgroundColor: "#E0F7FA",
    borderRadius: 10,
    padding: theme.spacing.medium,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.large,
  },
  healthCheckIcon: {
    width: 30,
    height: 30,
    marginRight: theme.spacing.medium,
  },
  healthCheckText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  filterButtonActive: {
    backgroundColor: "#00a9a4",
    borderColor: "#F2F0F0",
  },
  filterText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
  filterTextActive: {
    color: "#fff",
  },
  mainFeaturesWrapper: {
    height: 150, // hoặc 120 tuỳ ý bạn
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.medium,
  },
});
