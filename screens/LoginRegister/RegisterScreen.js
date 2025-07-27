import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { registerUser } from "../../services/apiAuth";
import { CustomButton } from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import useAddress from "../../hooks/useAddress";
import { theme } from "../../theme/theme";

export default function RegisterScreen() {
  const scrollRef = useRef(null);
  const navigation = useNavigation();
  const { cities, wards, getCities, getWards, resetWards } = useAddress();

  const [selectedCityCode, setSelectedCityCode] = useState("");
  const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
  const [districts, setDistricts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    phone_number: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: {
      street: "",
      ward: "",
      district: "",
      city: "",
      country: "Việt Nam",
    },
  });

  useEffect(() => {
    getCities();
  }, []);

  useEffect(() => {
    if (cities.length > 0) {
      const defaultCity = cities.find(
        (c) => c.name === "Thành phố Hồ Chí Minh"
      );
      if (defaultCity) {
        setSelectedCityCode(defaultCity.code.toString());
        setDistricts(defaultCity.districts || []);
        handleAddressChange("city", defaultCity.name);
        handleAddressChange("district", "");
        handleAddressChange("ward", "");
      }
    }
  }, [cities]);

  useEffect(() => {
    if (selectedDistrictCode) {
      getWards(selectedDistrictCode);
    }
  }, [selectedDistrictCode]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const handleCityChange = (code) => {
    const city = cities.find((c) => c.code === parseInt(code));
    setSelectedCityCode(code);
    setDistricts(city?.districts || []);
    setSelectedDistrictCode("");
    resetWards();

    handleAddressChange("city", city?.name || "");
    handleAddressChange("district", "");
    handleAddressChange("ward", "");
  };

  const handleDistrictChange = (code) => {
    const district = districts.find((d) => d.code === parseInt(code));
    setSelectedDistrictCode(code);
    getWards(code);

    handleAddressChange("district", district?.name || "");
    handleAddressChange("ward", "");
  };

  const handleWardChange = (wardCode) => {
    const ward = wards.find((w) => w.code === parseInt(wardCode));
    handleAddressChange("ward", ward?.name || "");
  };

  const formatDobForSubmit = (dobString) => {
    try {
      const [day, month, year] = dobString.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    } catch {
      return "";
    }
  };

  const validate = () => {
    const {
      first_name,
      last_name,
      dob,
      phone_number,
      email,
      password,
      confirmPassword,
      address,
    } = formData;

    if (
      !first_name ||
      !last_name ||
      !dob ||
      !phone_number ||
      !email ||
      !password ||
      !confirmPassword ||
      !address.street ||
      !address.ward ||
      !address.district ||
      !address.city ||
      !address.country
    ) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ tất cả các trường bắt buộc.");
      return false;
    }

    if (!/^84\d{9}$/.test(phone_number)) {
      Alert.alert("Lỗi", "Số điện thoại phải bắt đầu bằng 84 và đủ 11 số.");
      return false;
    }

    const dobRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d\d$/;
    if (!dobRegex.test(dob)) {
      Alert.alert("Lỗi", "Ngày sinh không đúng định dạng dd/mm/yyyy.");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu không khớp.");
      return false;
    }

    return true;
  };
  const handleRegister = async () => {
    if (!validate()) return;

    setIsLoading(true); // Bắt đầu loading
    const payload = {
      ...formData,
      dob: formatDobForSubmit(formData.dob),
    };

    try {
      const response = await registerUser(payload);
      if (response?.data?.success) {
        Alert.alert(
          "🎉 Thành công",
          "Đăng ký thành công! Vui lòng kiểm tra email để xác minh."
        );
        navigation.navigate("Login");
      } else {
        Alert.alert("❌ Lỗi", response?.data?.message || "Đăng ký thất bại.");
      }
    } catch (error) {
      Alert.alert("❌ Lỗi", "Đăng ký thất bại.");
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  const renderPickerField = (label, selectedValue, onValueChange, options) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputLike}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
        >
          <Picker.Item label={`Chọn ${label}`} value="" />
          {options.map((item) => (
            <Picker.Item
              key={item.code}
              label={item.name}
              value={item.code.toString()}
            />
          ))}
        </Picker>
      </View>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
        ref={scrollRef}
      >
        <Text style={styles.header}>ĐĂNG KÝ</Text>

        <Text style={styles.label}>Họ</Text>
        <TextInput
          style={styles.input}
          value={formData.first_name}
          onChangeText={(text) => handleChange("first_name", text)}
        />

        <Text style={styles.label}>Tên</Text>
        <TextInput
          style={styles.input}
          value={formData.last_name}
          onChangeText={(text) => handleChange("last_name", text)}
        />

        <Text style={styles.label}>Ngày sinh (dd/mm/yyyy)</Text>
        <TextInput
          style={styles.input}
          value={formData.dob}
          onChangeText={(text) => handleChange("dob", text)}
        />

        <Text style={styles.label}>Số điện thoại (bắt đầu 84)</Text>
        <TextInput
          style={styles.input}
          value={formData.phone_number}
          onChangeText={(text) => handleChange("phone_number", text)}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Mật khẩu</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => handleChange("password", text)}
        />

        <Text style={styles.label}>Nhập lại mật khẩu</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={formData.confirmPassword}
          onChangeText={(text) => handleChange("confirmPassword", text)}
        />

        <Text style={styles.label}>Số nhà, đường</Text>
        <TextInput
          style={styles.input}
          value={formData.address.street}
          onChangeText={(text) => handleAddressChange("street", text)}
        />

        {formData.address.district &&
          renderPickerField(
            "Phường/Xã",
            wards
              .find((w) => w.name === formData.address.ward)
              ?.code?.toString() || "",
            handleWardChange,
            wards
          )}

        {renderPickerField(
          "Quận/Huyện",
          selectedDistrictCode,
          handleDistrictChange,
          districts
        )}

        {renderPickerField(
          "Tỉnh/Thành phố",
          selectedCityCode,
          handleCityChange,
          cities
        )}

        <Text style={styles.label}>Quốc gia</Text>
        <TextInput
          style={styles.input}
          value={formData.address.country}
          onChangeText={(text) => handleAddressChange("country", text)}
        />

        <CustomButton
          title={isLoading ? "Đang đăng ký..." : "ĐĂNG KÝ"}
          onPress={handleRegister}
          type="primary"
          disabled={isLoading}
        />

        <View style={{ marginTop: 10 }}>
          <CustomButton
            title="TRỞ VỀ ĐĂNG NHẬP"
            onPress={() => navigation.navigate("Login")}
            type="secondary"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#00a9a4",
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  inputLike: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: "100%",
  },
});
