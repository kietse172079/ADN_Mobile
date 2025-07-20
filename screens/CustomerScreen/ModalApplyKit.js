// screens/CustomerScreen/ModalApplyKit.js
import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import useSample from "../../hooks/useSample";

const sampleTypeOptions = [
  { label: "Máu", value: "blood" },
  { label: "Nước bọt", value: "saliva" },
  { label: "Tóc", value: "hair" },
];

const ModalApplyKit = ({ visible, onClose, appointmentId, onSubmit }) => {
  const { addSamples } = useSample();
  const scrollRef = useRef(null);

  const initialFormData = {
    sample_types: [],
    notes: "",
    personInfoList: [
      {
        key: Date.now(),
        name: "",
        dob: "",
        relationship: "",
        birth_place: "",
        nationality: "",
        identity_document: "",
      },
    ],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  // Reset form mỗi khi mở lại modal
  useEffect(() => {
    if (visible) {
      setFormData({
        ...initialFormData,
        personInfoList: [
          {
            key: Date.now(),
            name: "",
            dob: "",
            relationship: "",
            birth_place: "",
            nationality: "",
            identity_document: "",
          },
        ],
      });
    }
  }, [visible]);

  const handleAddPerson = () => {
    setFormData((prev) => ({
      ...prev,
      personInfoList: [
        ...prev.personInfoList,
        {
          key: Date.now(),
          name: "",
          dob: "",
          relationship: "",
          birth_place: "",
          nationality: "",
          identity_document: "",
        },
      ],
    }));
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const handleRemovePerson = (index) => {
    setFormData((prev) => ({
      ...prev,
      personInfoList: prev.personInfoList.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (index, field, value) => {
    setFormData((prev) => {
      const newPersonInfoList = [...prev.personInfoList];
      newPersonInfoList[index] = {
        ...newPersonInfoList[index],
        [field]: value,
      };
      return { ...prev, personInfoList: newPersonInfoList };
    });
  };

  const convertToDateString = (input) => {
    // Nếu đã đúng định dạng ISO (YYYY-MM-DDTHH:mm:ssZ) thì giữ nguyên
    if (/^\d{4}-\d{2}-\d{2}T00:00:00Z$/.test(input)) return input;
    // Nếu đúng dạng YYYY-MM-DD thì chuyển sang ISO
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
      return `${input}T00:00:00Z`;
    }
    // Nếu nhập dạng DD/MM/YYYY thì chuyển sang ISO
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(input)) {
      const [d, m, y] = input.split("/");
      return `${y}-${m}-${d}T00:00:00Z`;
    }
    // Nếu không đúng, trả về rỗng
    return "";
  };

  const handleSubmit = async () => {
    if (formData.sample_types.length < 2) {
      Alert.alert("Lỗi", "Vui lòng chọn ít nhất 2 loại mẫu!");
      return;
    }
    if (formData.personInfoList.length < 2) {
      Alert.alert("Lỗi", "Vui lòng thêm ít nhất 2 người lấy mẫu!");
      return;
    }

    // Chuẩn hóa ngày sinh trước khi kiểm tra
    const hasInvalidPerson = formData.personInfoList.some((p) => {
      const dob = convertToDateString((p.dob || "").trim());
      return (
        !p.name ||
        !dob ||
        !/^\d{4}-\d{2}-\d{2}T00:00:00Z$/.test(dob) ||
        !p.relationship ||
        !p.birth_place ||
        !p.nationality ||
        !p.identity_document
      );
    });

    if (hasInvalidPerson) {
      Alert.alert(
        "Lỗi",
        "Vui lòng nhập đầy đủ thông tin và đúng định dạng ngày sinh (YYYY-MM-DD hoặc DD/MM/YYYY) cho tất cả người lấy mẫu"
      );
      return;
    }

    setSubmitting(true);
    const payload = {
      appointment_id: appointmentId,
      sample_types: formData.sample_types,
      notes: formData.notes,
      person_info_list: formData.personInfoList.map((p) => ({
        ...p,
        dob: convertToDateString((p.dob || "").trim()),
      })),
    };
    // console.log("Payload gửi lên:", payload);
    try {
      const res = await addSamples(payload);
      // console.log("Kết quả trả về:", res);
      if (res.success && res.data?.success) {
        Alert.alert("Thành công", "Yêu cầu bộ dụng cụ thành công!");
        onClose();
        setFormData({
          sample_types: [],
          notes: "",
          personInfoList: [
            {
              key: Date.now(),
              name: "",
              dob: "",
              relationship: "",
              birth_place: "",
              nationality: "",
              identity_document: "",
            },
          ],
        });
      } else if (res.data?.message === "No available kits found") {
        Alert.alert(
          "Lỗi",
          "Không còn bộ dụng cụ phù hợp để cấp phát. Vui lòng liên hệ quản trị viên hotline:  0869872830 hoặc thử lại sau."
        );
      } else {
        Alert.alert(
          "Lỗi",
          res.data?.error || res.error || "Yêu cầu bộ dụng cụ thất bại"
        );
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message || "Yêu cầu bộ dụng cụ thất bại");
      console.log("Lỗi khi gọi API:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      transparent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            width: "80%",
            maxHeight: "90%",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Yêu cầu bộ dụng cụ
          </Text>
          <ScrollView ref={scrollRef} keyboardShouldPersistTaps="handled">
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
              Chọn loại mẫu
            </Text>
            {sampleTypeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 5,
                }}
                onPress={() => {
                  setFormData((prev) => {
                    const exists = prev.sample_types.includes(option.value);
                    return {
                      ...prev,
                      sample_types: exists
                        ? prev.sample_types.filter((v) => v !== option.value)
                        : [...prev.sample_types, option.value],
                    };
                  });
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderWidth: 1,
                    borderColor: "#00a9a4",
                    backgroundColor: formData.sample_types.includes(
                      option.value
                    )
                      ? "#00a9a4"
                      : "#fff",
                    marginRight: 8,
                    borderRadius: 4,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {formData.sample_types.includes(option.value) && (
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>✓</Text>
                  )}
                </View>
                <Text>{option.label}</Text>
              </TouchableOpacity>
            ))}

            <TextInput
              label="Ghi chú"
              placeholder="Nhập ghi chú (nếu có)"
              value={formData.notes}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, notes: text }))
              }
              mode="outlined"
              style={{ marginBottom: 10 }}
            />
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
              Danh sách người lấy mẫu
            </Text>
            {formData.personInfoList.map((person, idx) => (
              <View
                key={person.key}
                style={{
                  marginBottom: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#f0f0f0",
                  paddingBottom: 10,
                }}
              >
                <TextInput
                  label="Họ và tên"
                  placeholder="Nhập họ và tên"
                  value={person.name}
                  onChangeText={(text) => handleInputChange(idx, "name", text)}
                  mode="outlined"
                  style={{ marginBottom: 5 }}
                />
                <TextInput
                  label="Ngày sinh"
                  placeholder="VD: 01/01/2000"
                  value={person.dob}
                  onChangeText={(text) => handleInputChange(idx, "dob", text)}
                  mode="outlined"
                  style={{ marginBottom: 5 }}
                />
                <TextInput
                  label="Quan hệ"
                  placeholder="VD: Cha, Mẹ, Con..."
                  value={person.relationship}
                  onChangeText={(text) =>
                    handleInputChange(idx, "relationship", text)
                  }
                  mode="outlined"
                  style={{ marginBottom: 5 }}
                />
                <TextInput
                  label="Nơi sinh"
                  placeholder="Nhập nơi sinh"
                  value={person.birth_place}
                  onChangeText={(text) =>
                    handleInputChange(idx, "birth_place", text)
                  }
                  mode="outlined"
                  style={{ marginBottom: 5 }}
                />
                <TextInput
                  label="Quốc tịch"
                  placeholder="Nhập quốc tịch"
                  value={person.nationality}
                  onChangeText={(text) =>
                    handleInputChange(idx, "nationality", text)
                  }
                  mode="outlined"
                  style={{ marginBottom: 5 }}
                />
                <TextInput
                  label="Giấy tờ tùy thân"
                  placeholder="CMND/CCCD/Hộ chiếu"
                  value={person.identity_document}
                  onChangeText={(text) =>
                    handleInputChange(idx, "identity_document", text)
                  }
                  mode="outlined"
                  style={{ marginBottom: 5 }}
                />
                {formData.personInfoList.length > 1 && (
                  <Button
                    mode="contained"
                    onPress={() => handleRemovePerson(idx)}
                    style={{ marginTop: 5, backgroundColor: "#00a9a4" }}
                    labelStyle={{ color: "#fff", fontWeight: "bold" }}
                  >
                    Xóa
                  </Button>
                )}
              </View>
            ))}
            <Button
              mode="outlined"
              onPress={handleAddPerson}
              style={{ marginTop: 10, borderColor: "#00a9a4" }}
              labelStyle={{ color: "#00a9a4", fontWeight: "bold" }}
            >
              Thêm người
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={submitting}
              disabled={submitting}
              style={{ marginTop: 20, backgroundColor: "#00a9a4" }}
              labelStyle={{ color: "#fff", fontWeight: "bold" }}
            >
              Gửi yêu cầu
            </Button>
            <Button
              mode="text"
              onPress={onClose}
              style={{ marginTop: 10 }}
              labelStyle={{ color: "#00a9a4", fontWeight: "bold" }}
            >
              Hủy
            </Button>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ModalApplyKit;
