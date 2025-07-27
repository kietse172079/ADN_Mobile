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
import { useAppointment } from "../../../hooks/useAppointment";
import { useSlot } from "../../../hooks/useSlot";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CreateAppointmentCivil({ route, navigation }) {
  const { serviceId } = route.params;
  const [type, setType] = useState("self");
  const [collectionAddress, setCollectionAddress] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

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
    // if (type === "self") return; // Không cần lấy slot nếu tự lấy mẫu
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
    // if (type === "self") {
    //   if (!serviceId) {
    //     Alert.alert("Vui lòng chọn dịch vụ!");
    //     return;
    //   }
    // } else if (type === "facility") {
    //   if (!serviceId || !selectedSlot) {
    //     Alert.alert("Vui lòng chọn dịch vụ và slot!");
    //     return;
    //   }
    // } else if (type === "home") {
    //   if (!serviceId || !selectedSlot || !collectionAddress) {
    //     Alert.alert("Vui lòng nhập đầy đủ thông tin và chọn slot!");
    //     return;
    //   }
    // }
    if (!serviceId || !selectedSlot) {
      Alert.alert("Vui lòng chọn dịch vụ và slot!");
      return;
    }

    if (type === "home" && !collectionAddress) {
      Alert.alert("Vui lòng nhập địa chỉ lấy mẫu!");
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
      type: type || "self",
    };
    // console.log("Sending payload:", payload);
    // console.log("Using token:", token);
    // if (type !== "self") payload.slot_id = selectedSlot.id;
    if (selectedSlot?.id) payload.slot_id = selectedSlot.id;
    if (type === "home") payload.collection_address = collectionAddress;
    try {
      const result = await bookAppointment(payload);
      console.log("Book appointment result:", result);
      if (result) {
        // Alert.alert("Đặt lịch thành công!");
        // navigation.goBack();
        navigation.navigate("PayOSMethodWebViewScreen", {
          appointmentId: result._id,
        });
      } else {
        Alert.alert("Đặt lịch thất bại!", "Không nhận được phản hồi từ server");
      }
    } catch (error) {
      console.log("Error during booking:", error);
      
      // Alert.alert(
      //   "Đặt lịch thất bại!",
      //   error.message || "Có lỗi không xác định"
      // );
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

      <Text style={styles.label}>Phương thức lấy mẫu</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={type}
          onValueChange={setType}
          style={styles.picker}
        >
          <Picker.Item label="Tự gửi mẫu" value="self" />
          <Picker.Item label="Lấy mẫu tại nhà" value="home" />
          <Picker.Item label="Lấy mẫu tại cơ sở" value="facility" />
        </Picker>
      </View>

      <Text style={styles.label}>Ngày bắt đầu (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        value={startDate}
        onChangeText={(text) => {
          const date = new Date(text);
          if (!isNaN(date.getTime()) || text === "") setStartDate(text);
          else Alert.alert("Lỗi", "Định dạng ngày không hợp lệ!");
        }}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.label}>Ngày kết thúc (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={endDate} editable={false} />
      {/* <TextInput
        style={styles.input}
        value={endDate}
        onChangeText={(text) => setEndDate(text)}
      /> */}

      {/* <Text style={styles.label}>Loại lấy mẫu (lọc slot)</Text> */}
      {/* <View style={styles.pickerWrapper}>
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
      </View> */}

      {type === "home" && (
        <>
          <Text style={styles.label}>Địa chỉ lấy mẫu</Text>
          <TextInput
            style={styles.input}
            value={collectionAddress}
            onChangeText={setCollectionAddress}
            placeholder="Nhập địa chỉ"
          />
        </>
      )}

      <Text style={styles.label}>Chọn lịch hẹn</Text>
      {isLoadingSlots || loadingSlotsFromHook ? (
        <ActivityIndicator size="small" color="#007AFF" />
      ) : slotError ? (
        <Text style={styles.error}>{slotError}</Text>
      ) : (
        <FlatList
          data={slots}
          keyExtractor={(item) => item.id}
          extraData={selectedSlot}
          renderItem={({ item }) => {
            const isSelected = selectedSlot?.id === item.id;
            const isDisabled = type === "self";
            return (
              <TouchableOpacity
                // style={[
                //   styles.slotItem,
                //   isSelected && !isDisabled && styles.slotItemSelected,
                //   isDisabled && { opacity: 0.5 },
                // ]}
                // onPress={() => {
                //   if (!isDisabled) handleSlotPress(item);
                // }}
                // activeOpacity={isDisabled ? 1 : 0.7}
                // disabled={isDisabled}
                style={[styles.slotItem, isSelected && styles.slotItemSelected]}
                onPress={() => handleSlotPress(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.slotText}>
                  {new Date(item.start_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  -{" "}
                  {new Date(item.end_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  , ngày {new Date(item.start_time).toLocaleDateString()}
                </Text>
                <Text style={styles.slotStaff}>
                  Nhân viên: {item.staff?.user_id?.first_name || "N/A"}
                </Text>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.error}>Không có slot nào khả dụng</Text>
          }
          style={{ maxHeight: 200, marginBottom: 10 }}
        />
      )}
      {/* {type === "self" && (
        <Text style={styles.info}>
          Vì tự gửi mẫu nên quý khách có thể chọn lịch hẹn hoặc không, chúng tôi
          sẽ thông báo khi nhận được mẫu và trả kết quả trong vòng 3 ngày từ
          ngày nhận mẫu.
        </Text>
      )} */}

      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={isSubmitting}
        activeOpacity={0.8}
      >
        <Text style={styles.submitButtonText}>Đặt lịch</Text>
      </TouchableOpacity>
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
    height: 50,
    width: "100%",
  },
  error: { color: "red", marginTop: 10, textAlign: "center" },
  info: {
    color: "#007AFF",
    marginTop: 10,
    marginBottom: 10,
    fontStyle: "italic",
    textAlign: "center",
  },
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
  submitButton: {
    backgroundColor: "#00a9a4",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
});
