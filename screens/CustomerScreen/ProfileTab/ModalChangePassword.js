import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import useUser from "../../../hooks/useUser";
import useAuth from "../../../hooks/useAuth";

const fields = [
  { key: "old_password", label: "Mật khẩu hiện tại" },
  { key: "new_password", label: "Mật khẩu mới" },
  { key: "confirm_password", label: "Xác nhận mật khẩu mới" },
];

const ModalChangePassword = ({ visible, onClose }) => {
  const { changeUserPassword, isChangingPassword } = useUser();
  const { userId, user } = useAuth();
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState({
    old_password: false,
    new_password: false,
    confirm_password: false,
  });
//   console.log("userId:", userId);

  if (user?.google_id) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async () => {
    if (form.new_password !== form.confirm_password) {
      Alert.alert("Lỗi", "Mật khẩu mới không khớp");
      return;
    }
    if (form.new_password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu mới phải dài ít nhất 6 ký tự");
      return;
    }
    const result = await changeUserPassword({
      user_id: userId,
      old_password: form.old_password,
      new_password: form.new_password,
    });
    if (result.success) {
      Alert.alert("Thành công", "Đổi mật khẩu thành công");
      onClose();
    } else {
      Alert.alert("Lỗi", result.error?.message || "Không thể đổi mật khẩu");
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.header}>Đổi mật khẩu</Text>

        {fields.map(({ key, label }) => (
          <View key={key} style={styles.inputWrapper}>
            <TextInput
              placeholder={label}
              secureTextEntry={!showPassword[key]}
              style={styles.input}
              value={form[key]}
              onChangeText={(text) => handleChange(key, text)}
            />
            <TouchableOpacity
              style={styles.icon}
              onPress={() => togglePasswordVisibility(key)}
            >
              <Feather
                name={showPassword[key] ? "eye" : "eye-off"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.buttonCancel} onPress={onClose}>
            <Text style={styles.buttonText}>Huỷ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonSave}
            onPress={handleSubmit}
            disabled={isChangingPassword}
          >
            <Text style={styles.buttonText}>
              {isChangingPassword ? "Đang xử lý..." : "Xác nhận"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: "center" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  inputWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    paddingRight: 40,
  },
  icon: {
    position: "absolute",
    right: 10,
    top: 12,
  },
  actions: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonCancel: {
    backgroundColor: "#aaa",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  buttonSave: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default ModalChangePassword;
