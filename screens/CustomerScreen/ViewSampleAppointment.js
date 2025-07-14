// screens/CustomerScreen/ViewSampleAppointment.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { Button, Card, Checkbox } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  getSamplesByAppointment,
  submitSamples,
  uploadSamplePersonImage,
} from "../../feartures/sample/sampleSlice";
import * as ImagePicker from "expo-image-picker";

const ViewSampleAppointment = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { appointmentId, samples: initialSamples } = route.params || {};
  const { samples, loading } = useSelector((state) => state.sample);
  const [selectedSampleIds, setSelectedSampleIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSamples();
  }, [appointmentId]);

  const fetchSamples = async () => {
    try {
      const res = await dispatch(
        getSamplesByAppointment(appointmentId)
      ).unwrap();
      if (res.success) {
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch samples");
    }
  };

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
    setSubmitting(true);
    try {
      const res = await dispatch(
        submitSamples(selectedSampleIds, firstSample.collection_date)
      ).unwrap();
      if (res.success) {
        Alert.alert("Success", "Submit successful!");
        setSelectedSampleIds([]);
        fetchSamples();
      } else {
        Alert.alert("Error", "Submit failed!");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Submit failed!");
    } finally {
      setSubmitting(false);
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
        const res = await dispatch(
          uploadSamplePersonImage({ sampleId, imageFile })
        ).unwrap();
        if (res.success) {
          Alert.alert("Success", "Image uploaded successfully!");
          fetchSamples();
        } else {
          Alert.alert("Error", "Failed to upload image!");
        }
      } catch (error) {
        Alert.alert("Error", error.message || "Failed to upload image!");
      }
    }
  };

  const renderItem = ({ item }) => (
    <Card style={{ marginBottom: 10, padding: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
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
        <Text>Mã mẫu: {item._id.slice(-8)}</Text>
        <TouchableOpacity onPress={() => handleUploadImage(item._id)}>
          <Text
            style={{ color: "#00a9a4", marginLeft: 10, fontWeight: "bold" }}
          >
            Tải ảnh
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={{ padding: 10 }}>
      {/* <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text
          style={{ color: "#00a9a4", marginBottom: 10, fontWeight: "bold" }}
        >
          Quay lại
        </Text>
      </TouchableOpacity> */}

      <FlatList
        data={samples.length ? samples : initialSamples || []}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text>Không tìm thấy mẫu nào.</Text>}
      />

      <Button
        mode="contained"
        onPress={handleSubmitSamples}
        loading={submitting}
        disabled={!selectedSampleIds.length || submitting}
        style={{ marginBottom: 10, backgroundColor: "#00a9a4" }}
        labelStyle={{ color: "#fff", fontWeight: "bold" }}
      >
        Gửi mẫu đã chọn ({selectedSampleIds.length})
      </Button>
    </View>
  );
};

export default ViewSampleAppointment;
