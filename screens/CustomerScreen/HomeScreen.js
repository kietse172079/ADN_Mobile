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
import { useService } from "../../hooks/useService";
import { theme } from "../../theme/theme";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function HomeScreen({ navigation }) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const { services, loading, getServices } = useService();
  const [selectedType, setSelectedType] = useState("");

  // Lọc dịch vụ theo loại đã chọn
  const filteredServices = selectedType
    ? services.filter((item) => item.type === selectedType)
    : services;

  useEffect(() => {
    getServices({
      pageNum: 1,
      pageSize: 10,
      is_active: true,
      sort_by: "created_at",
      sort_order: "desc",
      has_parent: true,
    });
  }, [getServices]);

  const mainFeatures = [
    { id: "1", title: "Lịch hẹn" },
    { id: "2", title: "Liên hệ" },
    { id: "3", title: "Tư vấn" },
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
                      : item.title === "Tư vấn"
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
    borderRadius: 12,
    marginBottom: theme.spacing.medium,
  },
  mainFeaturesWrapper: {
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.medium,
  },
  featuresContainer: {
    marginVertical: theme.spacing.medium,
  },
  featureCard: {
    backgroundColor: "#E0F7F6", // nhẹ từ primary
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.small,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: theme.spacing.small,
    width: 90,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureIcon: {
    marginBottom: theme.spacing.small,
  },
  featureText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.primary,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.small,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: theme.spacing.medium,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  filterTextActive: {
    color: "#fff",
  },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.small,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: theme.spacing.medium,
    backgroundColor: "#eee",
  },
  serviceTextContainer: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "bold",
  },
});
