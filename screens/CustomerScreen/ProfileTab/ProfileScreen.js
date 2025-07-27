import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import useAuth from "../../../hooks/useAuth";
import { CustomButton } from "../../../components/Button";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "../../../feartures/user/authSlice";
import ModalEditProfile from "./ModalEditProfile";
import ModalChangePassword from "./ModalChangePassword";

export default function ProfileScreen() {
  const {
    avatar,
    firstName,
    lastName,
    address,
    dob,
    phoneNumber,
    email,
    gender,
    isLoading,
    userId,
    user,
    refreshUserData,
  } = useAuth();
  const dispatch = useDispatch();
  const [editVisible, setEditVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogout = async () => {
    dispatch(logout());
    await AsyncStorage.removeItem("accessToken");
    Alert.alert("Đăng xuất thành công");
  };

  const formattedDob = dob
    ? new Date(dob).toLocaleDateString("vi-VN")
    : "Chưa có";

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Feather name="user" size={48} color="#bbb" />
          </View>
        )}
      </View>
      <Text style={styles.fullName}>
        {firstName || ""} {lastName || ""}
      </Text>
      <View style={styles.infoBox}>
        <MaterialIcons name="email" size={20} color="#007AFF" />
        <Text style={styles.infoText}>Email: {email || "Chưa có"}</Text>
      </View>
      <View style={styles.infoBox}>
        <Feather name="phone" size={20} color="#007AFF" />
        <Text style={styles.infoText}>
          Số điện thoại: {phoneNumber || "Chưa có"}
        </Text>
      </View>
      <View style={styles.infoBox}>
        <Feather name="user" size={20} color="#007AFF" />
        <Text style={styles.infoText}>
          Giới tính:{" "}
          {gender === "male"
            ? "Nam"
            : gender === "female"
              ? "Nữ"
              : gender || "Chưa có"}
        </Text>
      </View>
      <View style={styles.infoBox}>
        <MaterialIcons name="cake" size={20} color="#007AFF" />
        <Text style={styles.infoText}>Ngày sinh: {formattedDob}</Text>
      </View>
      <View style={styles.infoBox}>
        <MaterialIcons name="location-on" size={20} color="#007AFF" />
        <Text style={styles.infoText}>
          Địa chỉ:{" "}
          {address
            ? `${address.street || ""}, ${address.ward || ""}, ${
                address.district || ""
              }, ${address.city || ""}, ${address.country || ""}`
            : "Chưa có"}
        </Text>
      </View>

      <View style={styles.logoutContainer}>
        <CustomButton
          title="Chỉnh sửa thông tin"
          onPress={() => setEditVisible(true)}
        />
        {!user?.google_id && (
          <CustomButton
            title="Đổi mật khẩu"
            onPress={() => setPasswordVisible(true)}
          />
        )}
        <CustomButton title="Đăng xuất" onPress={handleLogout} type="danger" />
      </View>

      {editVisible && (
        <ModalEditProfile
          visible={editVisible}
          onClose={() => setEditVisible(false)}
          refreshUserData={refreshUserData}
        />
      )}
      {passwordVisible && (
        <ModalChangePassword
          visible={passwordVisible}
          onClose={() => setPasswordVisible(false)}
          userId={userId}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f7f9fa",
    padding: 24,
  },
  avatarContainer: {
    marginTop: 40,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#007AFF",
    borderRadius: 60,
    padding: 4,
    backgroundColor: "#fff",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  fullName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#222",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
    flexShrink: 1,
  },
  logoutContainer: {
    marginTop: 32,
    width: "100%",
    gap: 12,
  },
});
