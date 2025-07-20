import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
  Modal,
} from "react-native";
import { Button, Card, Checkbox } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import useSample from "../../hooks/useSample";
import ViewSampleAppointmentDetail from "./ViewSampleAppointmentDetail";

const statusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "#FFA500"; // cam
    case "confirmed":
      return "#2196F3"; // xanh dương
    case "completed":
      return "#4CAF50"; // xanh lá
    case "cancelled":
      return "#F44336"; // đỏ
    case "sample_collected":
      return "#9907FA"; // tím
    case "sample_received":
      return "#FA07B9"; // hồng
    case "sample_assigned":
      return "#078dfaff"; // xanh dương nhạt
    case "testing":
      return "#5ED3EB"; // xanh nhạt
    case "received":
      return "#1f44e9ff";
    default:
      return "#9E9E9E"; // xám
  }
};

const translateStatus = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "Chờ xác nhận";
    case "confirmed":
      return "Đã xác nhận";
    case "completed":
      return "Hoàn thành";
    case "cancelled":
      return "Đã hủy";
    case "sample_collected":
      return "Đã lấy mẫu";
    case "sample_received":
      return "Đã nhận mẫu";
    case "sample_assigned":
      return "Đã phân công mẫu";
    case "testing":
      return "Đang xét nghiệm";
    case "received":
      return "Đã nhận";
    default:
      return status || "Không rõ";
  }
};

const Tag = ({ color, children }) => (
  <View style={[styles.tag, { backgroundColor: color }]}>
    <Text style={styles.tagText}>{children}</Text>
  </View>
);

const ViewSampleAppointment = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { appointmentId, samples: initialSamples } = route.params || {};
  const { samples, submitSamples, getSamplesByAppointment, uploadPersonImage } =
    useSample();
  const [selectedSampleIds, setSelectedSampleIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSampleId, setSelectedSampleId] = useState(null);

  useEffect(() => {
    fetchSamples();
  }, [appointmentId]);

  const fetchSamples = async () => {
    const res = await getSamplesByAppointment(appointmentId);
    if (res === undefined || res === null) {
      Alert.alert("Error", "Lỗi hệ thống, không thể lấy dữ liệu mẫu!");
    } else if (res.success === false && res.error) {
      Alert.alert("Error", res.error || "Failed to fetch samples");
    }
  };

  const navigateToPayment = () => {
    navigation.navigate("PaymentScreen", {
      appointmentId,
      sampleIds: sampleArray.map((s) => s._id),
    });
  };

  const sampleArray = samples.length ? samples : initialSamples || [];
  const paymentStatus = sampleArray[0]?.appointment_id?.payment_status;
  const appointmentStatus = sampleArray[0]?.appointment_id?.status;
  const kitStatus = sampleArray[0]?.kit_id?.status;
  const isBatchCompleted =
    appointmentStatus === "sample_collected" ||
    (appointmentStatus === "sample_received" && kitStatus === "used");

  const handleCheckboxChange = (sampleId, checked) => {
    setSelectedSampleIds((prev) =>
      checked ? [...prev, sampleId] : prev.filter((id) => id !== sampleId)
    );
  };

  const handleSubmitSamples = async () => {
    if (!selectedSampleIds.length) {
      Alert.alert("Error", "Please select at least one sample!");
      return;
    }
    const firstSample = samples.find((s) => selectedSampleIds.includes(s._id));
    if (!firstSample?.collection_date) {
      Alert.alert("Error", "Selected sample has no collection date!");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await submitSamples(
        selectedSampleIds,
        firstSample.collection_date
      );
      if (res.success && res.data?.success) {
        Alert.alert("Success", "Submit successful!");
        setSelectedSampleIds([]);
        await fetchSamples();
      } else {
        Alert.alert("Error", res.data?.error || res.error || "Submit failed!");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Submit failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadImage = async (sampleId) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Error", "Permission to access media library denied!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const imageFile = {
        uri: result.assets[0].uri,
        name: `image_${sampleId}.jpg`,
        type: "image/jpeg",
      };
      try {
        const res = await uploadPersonImage(sampleId, imageFile);
        if (res.success && res.data?.success) {
          Alert.alert("Success", "Image uploaded successfully!");
          await fetchSamples();
        } else {
          Alert.alert(
            "Error",
            res.data?.error || res.error || "Failed to upload image!"
          );
        }
      } catch (error) {
        Alert.alert("Error", error.message || "Failed to upload image!");
      }
    }
  };

  const handleViewDetail = (sampleId) => {
    setSelectedSampleId(sampleId);
    setModalVisible(true);
  };

  const handleImageUploadSuccess = () => {
    setModalVisible(false);
    fetchSamples(); // Làm mới danh sách sau khi upload ảnh
  };

  const renderItem = ({ item }) => {
    const canSelect =
      !isBatchCompleted &&
      (item.status === "pending" || item.status === "collected");
    const person = item.person_info || {};
    return (
      <Card style={styles.card}>
        <TouchableOpacity
          onPress={() => handleViewDetail(item._id)}
          style={styles.cardContent}
        >
          {canSelect ? (
            <Checkbox
              status={
                selectedSampleIds.includes(item._id) ? "checked" : "unchecked"
              }
              onPress={() =>
                handleCheckboxChange(
                  item._id,
                  !selectedSampleIds.includes(item._id)
                )
              }
              color="#00a9a4"
            />
          ) : (
            <View style={styles.placeholderCheckbox} />
          )}
          <View style={styles.avatarContainer}>
            {person.image_url ? (
              <Image
                source={{ uri: person.image_url }}
                style={styles.avatar}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.avatarInitial}>
                {person.name ? person.name.charAt(0).toUpperCase() : "?"}
              </Text>
            )}
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.nameText} numberOfLines={1}>
              {person.name || "Chưa có tên"}
            </Text>
            <Text style={styles.dobText} numberOfLines={1}>
              {person.dob
                ? new Date(person.dob).toLocaleDateString()
                : "Chưa có ngày sinh"}
            </Text>
            <Text style={styles.statusText} numberOfLines={1}>
              {isBatchCompleted
                ? "(Đã gửi mẫu)"
                : item.status !== "pending" && item.status !== "collected"
                  ? ""
                  : ""}
            </Text>
          </View>
          {/* <TouchableOpacity
            onPress={() => handleUploadImage(item._id)}
            style={styles.uploadButton}
          >
            <Text style={styles.uploadText}>Tải ảnh</Text>
          </TouchableOpacity> */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>Trạng thái: </Text>
            <Tag color={statusColor(item.status)}>
              {translateStatus(item.status)}
            </Tag>
          </View>
        </TouchableOpacity>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={sampleArray}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không tìm thấy mẫu nào.</Text>
        }
        contentContainerStyle={styles.listContent}
      />

      {appointmentStatus === "sample_received" && paymentStatus !== "paid" && (
        <Button
          mode="contained"
          onPress={navigateToPayment}
          style={styles.submitButton}
          labelStyle={styles.submitLabel}
        >
          Thanh toán
        </Button>
      )}

      <Button
        mode="contained"
        onPress={handleSubmitSamples}
        loading={isSubmitting}
        disabled={isBatchCompleted || !selectedSampleIds.length || isSubmitting}
        style={styles.submitButton}
        labelStyle={styles.submitLabel}
      >
        Gửi mẫu đã chọn ({selectedSampleIds.length})
      </Button>

      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <ViewSampleAppointmentDetail
            sampleId={selectedSampleId}
            onClose={() => setModalVisible(false)}
            onImageUploadSuccess={handleImageUploadSuccess}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    marginVertical: 6,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  placeholderCheckbox: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#eee",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
  },
  avatarInitial: {
    fontSize: 18,
    color: "#888",
  },
  infoContainer: {
    flex: 1,
    paddingRight: 10,
  },
  nameText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    maxWidth: "70%",
  },
  dobText: {
    color: "#666",
    fontSize: 14,
  },
  statusText: {
    color: "#888",
    fontSize: 12,
  },
  uploadButton: {
    padding: 5,
  },
  uploadText: {
    color: "#00a9a4",
    fontWeight: "bold",
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    padding: 20,
  },
  submitButton: {
    marginBottom: 10,
    backgroundColor: "#00a9a4",
    borderRadius: 8,
  },
  submitLabel: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  tag: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 4,
    alignSelf: "flex-start",
  },
  tagText: { color: "#fff", fontWeight: "bold" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default ViewSampleAppointment;
