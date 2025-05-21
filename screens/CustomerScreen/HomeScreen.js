import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../feartures/user/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "../../theme/theme";
import { CustomButton } from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function HomeScreen() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // const navigation = useNavigation();
  

  const handleLogout = async () => {
    dispatch(logout());
    await AsyncStorage.removeItem("accessToken");
    // navigation.navigate("Login");
    Alert.alert("Đăng xuất thành công");
  };

  const mainFeatures = [
    { id: "1", title: "Lịch hẹn" },
    { id: "2", title: "Liên hệ" },
    { id: "3", title: "Cộng đồng hỏi đáp" },
    { id: "4", title: "Sổ tiêm" },
  ];
  const newServices = [
    {
      id: "1",
      title: "Cộng dịch vụ khách hàng",
      subtitle: "Nhận - Tiên - Đề xuất",
      image: require("../../assets/DNA.jpg"),
    },
    {
      id: "2",
      title: "Đặt lịch nhận - Xác nhận lịch tư vấn",
      subtitle: "Xem ngay lịch khám, gói khám và bác sĩ",
      image: require("../../assets/DNA.jpg"),
    },
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

      {/* Dịch vụ mới */}
      <Text style={styles.sectionTitle}>Dịch vụ mới</Text>
      <FlatList
        data={newServices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.serviceCard}>
            <Image source={item.image} style={styles.serviceImage} />
            <View style={styles.serviceTextContainer}>
              <Text style={styles.serviceTitle}>{item.title}</Text>
              <Text style={styles.serviceSubtitle}>{item.subtitle}</Text>
            </View>
            <Image
              source={require("../../assets/DNA.jpg")}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        )}
        style={styles.servicesContainer}
      />

      <CustomButton title="Logout" onPress={handleLogout} type="primary" />
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
});
