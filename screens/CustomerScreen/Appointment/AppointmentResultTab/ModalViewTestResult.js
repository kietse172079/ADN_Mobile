import React, { useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import useResult from "../../../../hooks/useResult";

const ModalViewTestResult = ({ visible, onClose, appointmentId }) => {
  const { getResultsByAppointment, resultsByAppointment, isLoading } =
    useResult();

  useEffect(() => {
    if (visible && appointmentId) {
      getResultsByAppointment(appointmentId);
    }
  }, [visible, appointmentId]);

  const result = resultsByAppointment?.data || null;
  const customer = result?.customer_id || {};
  const sample = result?.sample_ids?.[0] || {};
  const dnaResult = result?.result_data || {};

  const renderRow = (label, value) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value || "N/A"}</Text>
    </View>
  );

  const handleDownloadPDF = async () => {
    const url = result?.report_url;
    if (url) {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert("Lỗi", "Không thể mở liên kết PDF");
      }
    } else {
      Alert.alert("Không có PDF", "Hệ thống không tìm thấy file báo cáo.");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Kết quả xét nghiệm DNA</Text>

            {isLoading ? (
              <ActivityIndicator size="large" color="#00a9a4" />
            ) : result ? (
              <>
                <Text style={styles.section}>Thông tin khách hàng</Text>
                {renderRow(
                  "Họ tên",
                  `${customer.first_name || ""} ${customer.last_name || ""}`
                )}
                {renderRow("Email", customer.email)}
                {renderRow("SĐT", customer.phone_number)}
                {renderRow(
                  "Ngày sinh",
                  customer.dob
                    ? new Date(customer.dob).toLocaleDateString("vi-VN")
                    : null
                )}

                <Text style={styles.section}>Chi tiết mẫu xét nghiệm</Text>
                {renderRow("Loại mẫu", sample.type)}
                {renderRow(
                  "Ngày lấy mẫu",
                  sample.collection_date
                    ? new Date(sample.collection_date).toLocaleDateString(
                        "vi-VN"
                      )
                    : null
                )}
                {renderRow("Tình trạng mẫu", sample.status)}
                {renderRow("Ghi chú", result.notes)}

                <Text style={styles.section}>Kết quả so khớp DNA</Text>
                {renderRow(
                  "Tỷ lệ trùng khớp",
                  `${dnaResult.dna_match_percentage || 0}%`
                )}
                {renderRow(
                  "Kết luận",
                  result.is_match
                    ? "Có khả năng quan hệ huyết thống"
                    : "Không có quan hệ huyết thống"
                )}
                {renderRow("Độ tin cậy", dnaResult.confidence_interval)}
                {renderRow(
                  "Xác suất",
                  dnaResult.probability ? `${dnaResult.probability}%` : null
                )}
                {renderRow("Số marker được test", dnaResult.markers_tested)}
                {renderRow("Số marker trùng khớp", dnaResult.markers_matched)}
                {renderRow(
                  "Ngày hoàn thành",
                  result.completed_at
                    ? new Date(result.completed_at).toLocaleDateString("vi-VN")
                    : null
                )}
                {renderRow(
                  "Kỹ thuật viên phụ trách",
                  result.laboratory_technician_id
                    ? `${result.laboratory_technician_id.first_name} ${result.laboratory_technician_id.last_name}`
                    : "N/A"
                )}

                {result.sample_ids?.length > 0 && (
                  <>
                    <Text style={styles.section}>
                      Chi tiết người được xét nghiệm
                    </Text>
                    {result.sample_ids.map((s, i) => (
                      <View key={i} style={styles.sampleCard}>
                        {renderRow("Tên", s.person_info?.name)}
                        {renderRow("Quan hệ", s.person_info?.relationship)}
                        {renderRow(
                          "Ngày sinh",
                          s.person_info?.dob
                            ? new Date(s.person_info.dob).toLocaleDateString(
                                "vi-VN"
                              )
                            : null
                        )}
                        {renderRow("Nơi sinh", s.person_info?.birth_place)}
                        {renderRow("Quốc tịch", s.person_info?.nationality)}
                        {renderRow("Loại mẫu", s.type)}
                        {renderRow("Phương pháp lấy mẫu", s.collection_method)}
                      </View>
                    ))}
                  </>
                )}
              </>
            ) : (
              <Text style={styles.errorText}>Không có kết quả xét nghiệm</Text>
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={onClose} style={styles.button}>
                <Text style={styles.buttonText}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDownloadPDF}
                style={[styles.button, styles.downloadButton]}
                disabled={!result?.report_url}
              >
                <Text style={styles.buttonText}>Tải PDF</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ModalViewTestResult;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    padding: 16,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    maxHeight: "90%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "#00a9a4",
  },
  section: {
    marginTop: 16,
    marginBottom: 6,
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  label: {
    color: "#555",
    fontWeight: "500",
    width: "48%",
  },
  value: {
    color: "#000",
    width: "48%",
    textAlign: "right",
  },
  sampleCard: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: "#00a9a4",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  downloadButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  errorText: {
    textAlign: "center",
    color: "#f00",
    marginTop: 20,
  },
});
