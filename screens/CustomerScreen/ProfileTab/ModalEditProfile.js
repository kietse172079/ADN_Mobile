import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import useAuth from "../../../hooks/useAuth";
import useUser from "../../../hooks/useUser";
import { format, parseISO } from "date-fns";

const ModalEditProfile = ({ visible, onClose }) => {
  const { user, refreshUserData, userId } = useAuth();
  const { updateUser, isUpdating } = useUser();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    dob: "",
    gender: "",
    address: {
      street: "",
      ward: "",
      district: "",
      city: "",
      country: "Việt Nam",
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone_number: user.phone_number ? user.phone_number.toString() : "",
        dob: user.dob ? format(new Date(user.dob), "dd/MM/yyyy") : "",
        gender: user.gender || "",
        address: user.address || {
          street: "",
          ward: "",
          district: "",
          city: "",
          country: "Việt Nam",
        },
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const formatDobForSubmit = (dobString) => {
    try {
      const [day, month, year] = dobString.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    } catch (err) {
      return ""; // fallback
    }
  };

  const handleSubmit = async () => {
    const cleanAddress = { ...formData.address };
    delete cleanAddress._id;

    const payload = {
      ...formData,
      dob: formatDobForSubmit(formData.dob),
      address: cleanAddress, // 👈 không JSON.stringify!
    };

    // console.log("Payload gửi lên:", payload);

    const result = await updateUser({ id: userId, updatedData: payload });

    if (result.success) {
      Alert.alert("Cập nhật thành công");
      await refreshUserData();
      onClose();
    } else {
      console.log("Error khi cập nhật:", result.error);
      Alert.alert(
        "Cập nhật thất bại",
        result.error?.message ||
          JSON.stringify(result.error) ||
          "Vui lòng thử lại"
      );
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Chỉnh sửa thông tin</Text>

        <TextInput
          placeholder="Họ"
          style={styles.input}
          value={formData.first_name}
          onChangeText={(text) => handleChange("first_name", text)}
        />
        <TextInput
          placeholder="Tên"
          style={styles.input}
          value={formData.last_name}
          onChangeText={(text) => handleChange("last_name", text)}
        />
        <TextInput
          placeholder="Số điện thoại"
          style={styles.input}
          value={formData.phone_number}
          onChangeText={(text) => handleChange("phone_number", text)}
        />
        <TextInput
          placeholder="Ngày sinh (dd/mm/yyyy)"
          style={styles.input}
          value={formData.dob}
          onChangeText={(text) => handleChange("dob", text)}
        />
        <TextInput
          placeholder="Giới tính (male/female)"
          style={styles.input}
          value={formData.gender}
          onChangeText={(text) => handleChange("gender", text)}
        />

        <Text style={styles.subHeader}>Địa chỉ</Text>
        {["street", "ward", "district", "city", "country"].map((key) => (
          <TextInput
            key={key}
            placeholder={key}
            style={styles.input}
            value={formData.address?.[key] || ""}
            onChangeText={(text) => handleAddressChange(key, text)}
          />
        ))}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.buttonCancel} onPress={onClose}>
            <Text style={styles.buttonText}>Huỷ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonSave}
            onPress={handleSubmit}
            disabled={isUpdating}
          >
            <Text style={styles.buttonText}>
              {isUpdating ? "Đang lưu..." : "Lưu"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  subHeader: { marginTop: 20, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 8,
    padding: 10,
    borderRadius: 8,
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
    backgroundColor: "#007AFF",
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

export default ModalEditProfile;
