import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { Button, Card, Checkbox } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import useSample from "../../hooks/useSample";

const ViewSampleAppointment = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { appointmentId, samples: initialSamples } = route.params || {};
  const { samples, submitSamples, getSamplesByAppointment, uploadPersonImage } =
    useSample();
  const [selectedSampleIds, setSelectedSampleIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Lấy trạng thái batch hoàn thành từ sample đầu tiên (nếu có)
  const sampleArray = samples.length ? samples : initialSamples || [];
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
        fetchSamples();
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
          fetchSamples();
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

  const renderItem = ({ item }) => {
    const canSelect =
      !isBatchCompleted &&
      (item.status === "pending" || item.status === "collected");
    const person = item.person_info || {};
    return (
      <Card style={{ marginVertical: 6, borderRadius: 12, elevation: 2 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
          }}
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
            <View style={{ width: 24, height: 24, marginRight: 8 }} />
          )}
          {/* Ảnh đại diện */}
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              overflow: "hidden",
              backgroundColor: "#eee",
              marginRight: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {person.image_url ? (
              <Image
                source={{ uri: person.image_url }}
                style={{ width: 40, height: 40 }}
                resizeMode="cover"
              />
            ) : (
              <Text style={{ fontSize: 18, color: "#888" }}>
                {person.name ? person.name.charAt(0).toUpperCase() : "?"}
              </Text>
            )}
          </View>
          {/* Thông tin người dùng */}
          <View>
            <Text style={{ fontWeight: "bold" }}>
              {person.name || "Chưa có tên"}
            </Text>
            <Text style={{ color: "#666" }}>
              {person.dob
                ? new Date(person.dob).toLocaleDateString()
                : "Chưa có ngày sinh"}
            </Text>
            <Text style={{ color: "#888", fontSize: 12 }}>
              {isBatchCompleted
                ? "(Đã hoàn thành)"
                : item.status !== "pending" && item.status !== "collected"
                  ? "(Đã gửi)"
                  : ""}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleUploadImage(item._id)}
            style={{ marginLeft: "auto" }}
          >
            <Text
              style={{
                color: "#00a9a4",
                marginLeft: 10,
                fontWeight: "bold",
              }}
            >
              Tải ảnh
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: "#f8f8f8", paddingHorizontal: 10 }}
    >
      <FlatList
        data={sampleArray}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text>Không tìm thấy mẫu nào.</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Button
        mode="contained"
        onPress={handleSubmitSamples}
        loading={isSubmitting}
        disabled={isBatchCompleted || !selectedSampleIds.length || isSubmitting}
        style={{ marginBottom: 10, backgroundColor: "#00a9a4" }}
        labelStyle={{ color: "#fff", fontWeight: "bold" }}
      >
        Gửi mẫu đã chọn ({selectedSampleIds.length})
      </Button>
    </View>
  );
};

export default ViewSampleAppointment;
