import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Button, Card } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import useSample from "../../hooks/useSample";

const ViewSampleAppointmentDetail = ({
  sampleId,
  onClose,
  onImageUploadSuccess,
}) => {
  const { getSampleById, uploadPersonImage, selectedSample, loading } =
    useSample();
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sampleId) {
      setVisible(true);
      fetchSampleDetail();
    }
  }, [sampleId]);

  useEffect(() => {
    if (selectedSample?.person_info?.image_url) {
      setImagePreview(selectedSample.person_info.image_url);
    }
  }, [selectedSample]);

  const fetchSampleDetail = async () => {
    try {
      const result = await getSampleById(sampleId);
      if (!result.success) Alert.alert("Error", "Không thể tải thông tin mẫu");
    } catch {
      Alert.alert("Error", "Có lỗi xảy ra khi tải thông tin mẫu");
    }
  };

  const handleImageUpload = async () => {
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
      setUploading(true);
      const imageFile = {
        uri: result.assets[0].uri,
        name: `image_${sampleId}.jpg`,
        type: "image/jpeg",
      };
      try {
        setImagePreview(result.assets[0].uri);
        const resultUpload = await uploadPersonImage(sampleId, imageFile);
        if (resultUpload.success) {
          Alert.alert("Success", "Upload ảnh thành công!");
          onImageUploadSuccess?.();
        } else Alert.alert("Error", "Upload ảnh thất bại!");
      } catch {
        Alert.alert("Error", "Có lỗi xảy ra khi upload ảnh");
      } finally {
        setUploading(false);
      }
    }
  };

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

  const getTypeColor = (type) => {
    return (
      {
        blood: "#ff4d4f", // máu - đỏ
        saliva: "#1890ff", // nước bọt - xanh dương
        hair: "#52c41a", // tóc - xanh lá
      }[type?.toLowerCase()] || "#d9d9d9"
    ); // xám mặc định
  };

  const translateType = (type) => {
    switch (type?.toLowerCase()) {
      case "blood":
        return "Mẫu Máu";
      case "saliva":
        return "Mẫu Nước bọt";
      case "hair":
        return "Mẫu Tóc";
      default:
        return type || "Không rõ";
    }
  };

  if (!selectedSample && loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#00a9a4" />
      </View>
    );
  }

  if (!selectedSample) return null;
  const sample = selectedSample;

  const InfoRow = ({ label, value, color }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, color && { color }]}>{value}</Text>
    </View>
  );

  const handleClose = () => {
    setVisible(false); // Đóng modal
    if (onClose) onClose(); // Gọi callback onClose từ parent
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={handleClose} // Đảm bảo modal có thể đóng khi nhấn back
    >
      <View style={styles.modalContainer}>
        <Card style={styles.detailCard}>
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            <View style={styles.header}>
              <Text style={styles.title}>Chi tiết mẫu</Text>
              <Text style={styles.sampleId}>{sample._id?.slice(-8)}</Text>
              <TouchableOpacity onPress={handleClose}>
                <Text style={styles.closeText}>Đóng</Text>
              </TouchableOpacity>
            </View>

            <Card style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Thông tin mẫu</Text>
              <InfoRow label="Mã mẫu:" value={sample._id} />
              <InfoRow label="Mã kit:" value={sample.kit_id?.code} />
              <InfoRow
                label="Loại mẫu:"
                value={translateType(sample.type)}
                color={getTypeColor(sample.type)}
              />
              <InfoRow
                label="Phương thức thu thập:"
                value={sample.collection_method}
              />
              <InfoRow
                label="Trạng thái:"
                value={translateStatus(sample.status)}
                color={statusColor(sample.status)}
              />
              <InfoRow
                label="Ngày thu thập:"
                value={new Date(sample.collection_date).toLocaleString()}
              />
              {sample.received_date && (
                <InfoRow
                  label="Ngày nhận:"
                  value={new Date(sample.received_date).toLocaleString()}
                />
              )}
            </Card>

            <Card style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Thông tin người</Text>
              <View style={styles.rowCenter}>
                <View style={styles.avatarContainer}>
                  {imagePreview ? (
                    <Image
                      source={{ uri: imagePreview }}
                      style={styles.avatar}
                    />
                  ) : (
                    <Text style={styles.avatarInitial}>
                      {sample.person_info?.name?.charAt(0).toUpperCase() || "?"}
                    </Text>
                  )}
                </View>
                <Button
                  mode="contained"
                  onPress={handleImageUpload}
                  loading={uploading}
                  style={styles.uploadButton}
                >
                  {imagePreview ? "Thay đổi ảnh" : "Tải ảnh lên"}
                </Button>
              </View>
              <InfoRow
                label="Họ và tên:"
                value={sample.person_info?.name || "Chưa có tên"}
              />
              <InfoRow
                label="Ngày sinh:"
                value={
                  sample.person_info?.dob
                    ? new Date(sample.person_info.dob).toLocaleDateString()
                    : "Chưa có"
                }
              />
              <InfoRow
                label="Mối quan hệ:"
                value={sample.person_info?.relationship || "-"}
              />
              <InfoRow
                label="Nơi sinh:"
                value={sample.person_info?.birth_place || "-"}
              />
              <InfoRow
                label="Quốc tịch:"
                value={sample.person_info?.nationality || "-"}
              />
              <InfoRow
                label="CMND/CCCD:"
                value={sample.person_info?.identity_document || "-"}
              />
            </Card>

            <Card style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Thông tin khác</Text>
              <InfoRow
                label="Ngày tạo:"
                value={new Date(sample.created_at).toLocaleString()}
              />
              <InfoRow
                label="Cập nhật lần cuối:"
                value={new Date(sample.updated_at).toLocaleString()}
              />
              <InfoRow
                label="Người tạo:"
                value={sample.created_by?.slice(-8)}
              />
            </Card>
          </ScrollView>
        </Card>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  detailCard: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
  },
  sampleId: {
    fontSize: 16,
    color: "#1890ff",
    marginHorizontal: 10,
  },
  closeText: {
    fontSize: 16,
    color: "#ff4d4f",
  },
  sectionCard: {
    margin: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#fafafa",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  label: {
    width: 120,
    fontWeight: "bold",
    color: "#555",
  },
  value: {
    flex: 1,
    color: "#333",
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatar: {
    width: 100,
    height: 100,
  },
  avatarInitial: {
    fontSize: 36,
    color: "#aaa",
  },
  uploadButton: {
    backgroundColor: "#00a9a4",
    borderRadius: 6,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ViewSampleAppointmentDetail;
