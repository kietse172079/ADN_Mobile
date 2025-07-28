import React from "react";
import { ScrollView, Text, View, StyleSheet, Image } from "react-native";

export default function HomeWebScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{
          uri: "https://genolife.com.vn/wp-content/uploads/2025/01/review-trung-tam-xet-nghiem-ADN-01-1024x683.jpg",
        }}
        style={styles.banner}
        resizeMode="cover"
      />

      <Text style={styles.title}>
        Chăm sóc bằng tài năng, y đức và sự thấu cảm
      </Text>

      <View style={styles.infoBoxes}>
        {[
          {
            title: "Gọi tổng đài",
            desc: "Tư vấn và hỗ trợ 24/7 cho các vấn đề của bạn",
          },
          {
            title: "Đặt lịch hẹn",
            desc: "Đặt lịch hẹn nhanh chóng, tiện lợi và chính xác",
          },
          {
            title: "Tư vấn bảo hiểm",
            desc: "Tư vấn bảo hiểm dễ dàng cùng chuyên gia và Blooding uy tín",
          },
        ].map((item, index) => (
          <View key={index} style={styles.infoBox}>
            <Text style={styles.infoTitle}>{item.title}</Text>
            <Text style={styles.infoDesc}>{item.desc}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Tại sao nên chọn Blooding?</Text>
      <View style={styles.whySection}>
        {[
          {
            title: "Chuyên gia hàng đầu",
            desc: "Blooding quy tụ đội ngũ bác sĩ và chuyên gia được đào tạo bài bản, giàu kinh nghiệm.",
          },
          {
            title: "Chất lượng quốc tế",
            desc: "Quy trình quản lý và xét nghiệm đạt tiêu chuẩn quốc tế nghiêm ngặt.",
          },
          {
            title: "Công nghệ tiên tiến",
            desc: "Trang thiết bị hiện đại, công nghệ xét nghiệm ADN tiên tiến hàng đầu.",
          },
          {
            title: "Nghiên cứu & Đổi mới",
            desc: "Luôn tiên phong ứng dụng khoa học trong dịch vụ y tế và di truyền học.",
          },
        ].map((item, index) => (
          <View key={index} style={styles.whyItem}>
            <Text style={styles.whyTitle}>{item.title}</Text>
            <Text style={styles.whyDesc}>{item.desc}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Theo dõi thêm tại:</Text>
      <Text style={styles.paragraph}>
        Website: blooding.vn{"\n"}
        Fanpage: facebook.com/bloodingdna
      </Text>
    </ScrollView>
  );
}

const PRIMARY_COLOR = "#00a9a4";

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  banner: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginBottom: 12,
    textAlign: "center",
  },
  infoBoxes: {
    marginBottom: 24,
  },
  infoBox: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#f2fefc",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d1f2ef",
  },
  infoTitle: {
    fontWeight: "600",
    fontSize: 16,
    color: "#008f8b",
    marginBottom: 4,
  },
  infoDesc: {
    fontSize: 14,
    lineHeight: 20,
    color: "#444",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: PRIMARY_COLOR,
    marginTop: 20,
    marginBottom: 10,
  },
  whySection: {
    marginBottom: 20,
  },
  whyItem: {
    marginBottom: 14,
    paddingBottom: 6,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
  },
  whyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#195eaa",
    marginBottom: 4,
  },
  whyDesc: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
  },
});
