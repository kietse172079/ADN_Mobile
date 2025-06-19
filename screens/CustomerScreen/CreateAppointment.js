import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAppointment } from "../../hooks/useAppointment";
import { useSlot } from "../../hooks/useSlot";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CreateAppointment({ route, navigation }) {
  const { serviceId } = route.params;
  const [type, setType] = useState("");
  const [collectionAddress, setCollectionAddress] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false); // Thêm trạng thái loading riêng

  const [selectedSlot, setSelectedSlot] = useState(null);

  const {
    loading: loadingAppointment,
    error,
    bookAppointment,
  } = useAppointment();
  const {
    slots,
    loading: loadingSlotsFromHook,
    error: slotError,
    getAvailableSlots,
  } = useSlot();

  useEffect(() => {
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      Alert.alert("Lỗi", "Ngày bắt đầu không hợp lệ!");
      return;
    }
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    setEndDate(end.toISOString().split("T")[0]);
  }, [startDate]);

  useEffect(() => {
    setIsLoadingSlots(true);
    const slotType = type === "" ? undefined : `${type}_collected`;
    getAvailableSlots({
      start_date: startDate,
      end_date: endDate,
      type: slotType,
    })
      .then(() => {
        // console.log("Slots fetched:", slots);
        // console.log("Slots fetched slotid:", slots.id);
      })
      .catch((err) => console.log("Error fetching slots:", err))
      .finally(() => setIsLoadingSlots(false));
  }, [startDate, endDate, type, getAvailableSlots]);

  const handleSubmit = async () => {
    if (!serviceId || !selectedSlot || !collectionAddress) {
      Alert.alert("Vui lòng nhập đầy đủ thông tin và chọn slot!");
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);

    const token = await AsyncStorage.getItem("accessToken");
    if (!token) {
      Alert.alert(
        "Lỗi",
        "Không tìm thấy token xác thực. Vui lòng đăng nhập lại!"
      );
      setIsSubmitting(false);
      return;
    }

    const payload = {
      service_id: serviceId,
      slot_id: selectedSlot.id,
      type: type || "self",
      collection_address: collectionAddress,
    };
    // console.log("Sending payload:", payload);
    // console.log("Using token:", token);
    try {
      const result = await bookAppointment(payload);
      console.log("Book appointment result:", result);
      if (result) {
        Alert.alert("Đặt lịch thành công!");
        navigation.goBack();
      } else {
        Alert.alert("Đặt lịch thất bại!", "Không nhận được phản hồi từ server");
      }
    } catch (error) {
      console.log("Error during booking:", error);
      Alert.alert(
        "Đặt lịch thất bại!",
        error.message || "Có lỗi không xác định"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSlotPress = (item) => {
    // console.log("Slot pressed:", item.id);
    setSelectedSlot((prev) => (prev?.id === item.id ? null : item));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ID dịch vụ: {serviceId}</Text>

      <Text style={styles.label}>Ngày bắt đầu (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        value={startDate}
        onChangeText={(text) => {
          const date = new Date(text);
          if (!isNaN(date.getTime()) || text === "") setStartDate(text);
          else Alert.alert("Lỗi", "Định dạng ngày không hợp lệ!");
        }}
        placeholder="2025-06-17"
      />

      <Text style={styles.label}>Ngày kết thúc (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={endDate} editable={false} />

      <Text style={styles.label}>Loại lấy mẫu (lọc slot)</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={type}
          onValueChange={setType}
          style={styles.picker}
        >
          <Picker.Item label="Tất cả" value="" />
          <Picker.Item label="Tự lấy mẫu" value="self" />
          <Picker.Item label="Lấy mẫu tại nhà" value="home" />
          <Picker.Item label="Lấy mẫu tại cơ sở" value="facility" />
        </Picker>
      </View>

      <Text style={styles.label}>Địa chỉ lấy mẫu</Text>
      <TextInput
        style={styles.input}
        value={collectionAddress}
        onChangeText={setCollectionAddress}
        placeholder="Nhập địa chỉ"
      />

      <Text style={styles.label}>Chọn slot thời gian</Text>
      {isLoadingSlots || loadingSlotsFromHook ? (
        <ActivityIndicator size="small" color="#007AFF" />
      ) : slotError ? (
        <Text style={styles.error}>{slotError}</Text>
      ) : (
        <FlatList
          data={slots}
          keyExtractor={(item) => item.id}
          extraData={selectedSlot} // Đảm bảo re-render khi selectedSlot thay đổi
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.slotItem,
                selectedSlot?.id === item.id && styles.slotItemSelected,
              ]}
              onPress={() => handleSlotPress(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.slotText}>
                {new Date(item.start_time).toLocaleString()} -{" "}
                {new Date(item.end_time).toLocaleTimeString()}
              </Text>
              <Text style={styles.slotStaff}>
                Nhân viên: {item.staff?.user_id?.first_name || "N/A"}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.error}>Không có slot nào khả dụng</Text>
          }
          style={{ maxHeight: 200, marginBottom: 10 }}
        />
      )}

      <Button title="Đặt lịch" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  label: { fontWeight: "bold", marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 8,
    overflow: "hidden",
  },
  picker: {
    height: 40,
    width: "100%",
  },
  error: { color: "red", marginTop: 10, textAlign: "center" },
  slotItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: "#f9f9f9",
  },
  slotItemSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#e6f0ff",
  },
  slotText: { fontWeight: "bold" },
  slotStaff: { fontSize: 13, color: "#555" },
});
