import React, { useState, useEffect, useRef } from "react";
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
import { Picker } from "@react-native-picker/picker";
import { format } from "date-fns";
import useAuth from "../../../hooks/useAuth";
import useUser from "../../../hooks/useUser";
import useAddress from "../../../hooks/useAddress";

const ModalEditProfile = ({ visible, onClose }) => {
  const scrollRef = useRef(null);
  const { user, refreshUserData, userId } = useAuth();
  const { updateUser, isUpdating } = useUser();
  const { cities, wards, loading, getCities, getWards, resetWards } =
    useAddress();

  const [selectedCityCode, setSelectedCityCode] = useState("");
  const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
  const [districts, setDistricts] = useState([]);

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
    if (visible && scrollRef.current) {
      scrollRef.current.scrollTo({ y: 0, animated: false });
    }
  }, [visible]);

  useEffect(() => {
    getCities();
  }, []);

  useEffect(() => {
    if (user) {
      const defaultCity = "Thành phố Hồ Chí Minh";
      const city = user.address?.city || defaultCity;
      const matchedCity = cities.find((c) => c.name === city);
      const matchedCityCode = matchedCity?.code?.toString() || "";

      const matchedDistrict = matchedCity?.districts?.find(
        (d) => d.name === user.address?.district
      );
      const matchedDistrictCode = matchedDistrict?.code?.toString() || "";

      setSelectedCityCode(matchedCityCode);
      setSelectedDistrictCode(matchedDistrictCode);
      setDistricts(matchedCity?.districts || []);

      if (matchedDistrictCode) getWards(matchedDistrictCode);

      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone_number: user.phone_number?.toString() || "",
        dob: user.dob ? format(new Date(user.dob), "dd/MM/yyyy") : "",
        gender: user.gender || "",
        address: {
          street: user.address?.street || "",
          ward: user.address?.ward || "",
          district: user.address?.district || "",
          city: user.address?.city || "",
          country: user.address?.country || "Việt Nam",
        },
      });
    }
  }, [user, cities]);

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

  const handleSubmit = async () => {
    const { first_name, last_name, phone_number, dob, gender, address } =
      formData;

    if (
      !first_name ||
      !last_name ||
      !phone_number ||
      !dob ||
      !gender ||
      !address.street
    ) {
      return Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin bắt buộc.");
    }

    if (!/^84\d{9}$/.test(phone_number)) {
      return Alert.alert(
        "Lỗi",
        "Số điện thoại phải bắt đầu bằng 84 và đủ 11 số."
      );
    }

    const dobRegex =
      /^(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[0-2])[/](19|20)\d\d$/;
    if (!dobRegex.test(dob)) {
      return Alert.alert("Lỗi", "Ngày sinh không đúng định dạng dd/mm/yyyy.");
    }
    const payload = {
      ...formData,
      dob: formatDobForSubmit(formData.dob),
      address: { ...formData.address },
    };

    const result = await updateUser({ id: userId, updatedData: payload });

    if (result.success) {
      Alert.alert("Cập nhật thành công");
      await refreshUserData();
      onClose();
    } else {
      Alert.alert(
        "Cập nhật thất bại",
        result.error?.message || "Vui lòng thử lại"
      );
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
    <Modal visible={visible} animationType="slide">
      <ScrollView contentContainerStyle={styles.container} ref={scrollRef}>
        <Text style={styles.header}>Chỉnh sửa thông tin</Text>
        <Text style={styles.subHeader}>Họ</Text>
        <TextInput
          placeholder="Họ"
          style={styles.input}
          value={formData.first_name}
          onChangeText={(text) => handleChange("first_name", text)}
        />
        <Text style={styles.subHeader}>Tên</Text>
        <TextInput
          placeholder="Tên"
          style={styles.input}
          value={formData.last_name}
          onChangeText={(text) => handleChange("last_name", text)}
        />
        <Text style={styles.subHeader}>Số điện thoại</Text>
        <TextInput
          placeholder="Số điện thoại"
          style={styles.input}
          value={formData.phone_number}
          onChangeText={(text) => handleChange("phone_number", text)}
        />
        <Text style={styles.subHeader}>Ngày sinh (dd/mm/yyyy)</Text>
        <TextInput
          placeholder="Ngày sinh (dd/mm/yyyy)"
          style={styles.input}
          value={formData.dob}
          onChangeText={(text) => handleChange("dob", text)}
        />
        <Text style={styles.subHeader}>Giới tính</Text>
        <View style={styles.genderContainer}>
          {/* <Text style={styles.label}>Giới tính</Text> */}
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => handleChange("gender", "male")}
            >
              <View style={styles.radioCircle}>
                {formData.gender === "male" && (
                  <View style={styles.radioSelected} />
                )}
              </View>
              <Text style={styles.radioLabel}>Nam</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => handleChange("gender", "female")}
            >
              <View style={styles.radioCircle}>
                {formData.gender === "female" && (
                  <View style={styles.radioSelected} />
                )}
              </View>
              <Text style={styles.radioLabel}>Nữ</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.subHeader}>Số nhà, đường</Text>

        <TextInput
          placeholder="Số nhà, đường"
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

        {districts.length > 0 &&
          renderPickerField(
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

        <Text style={styles.subHeader}>Quốc gia</Text>
        <TextInput
          placeholder="Quốc gia"
          style={styles.input}
          value={formData.address.country}
          onChangeText={(text) => handleAddressChange("country", text)}
        />

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
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00a9a4",
    marginBottom: 20,
    textAlign: "center",
  },
  subHeader: {
    marginTop: 20,
    fontWeight: "bold",
    color: "#333",
  },
  label: {
    marginTop: 10,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 8,
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  inputLike: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  picker: {
    flex: 1,
    height: 50,
  },
  icon: {
    position: "absolute",
    right: 10,
  },
  actions: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonCancel: {
    backgroundColor: "#ccc",
    padding: 14,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  buttonSave: {
    backgroundColor: "#00a9a4",
    padding: 14,
    borderRadius: 10,
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#00a9a4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#00a9a4",
  },
  radioLabel: {
    fontSize: 16,
  },
});

export default ModalEditProfile;
