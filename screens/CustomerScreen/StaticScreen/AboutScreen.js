import React from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
} from "react-native";

const values = [
  {
    icon: "💡",
    title: "CREATIVITY – SÁNG TẠO",
    desc: "Không ngừng sáng tạo và đổi mới nhằm mang lại các giải pháp tốt nhất cho người bệnh.",
  },
  {
    icon: "👥",
    title: "ACCOUNTABILITY – TRÁCH NHIỆM",
    desc: "Chịu trách nhiệm cao nhất với bệnh nhân và người nhà về y đức, kỹ năng, tri thức và chuyên môn.",
  },
  {
    icon: "🤝",
    title: "RELIABILITY – TIN CẬY",
    desc: "Cam kết mang lại độ tin cậy cao nhất với dịch vụ y tế chất lượng và an toàn.",
  },
  {
    icon: "🏆",
    title: "EXCELLENCE – HOÀN HẢO",
    desc: "Hướng tới chất lượng dịch vụ cao nhất và quy trình khám chữa bệnh tốt nhất.",
  },
];

const stats = [
  ["85%", "Mức độ hài lòng của khách hàng"],
  ["1.505", "Bệnh viện"],
  ["6 triệu", "Khách hàng khám phục vụ"],
  ["4 triệu", "Lượt khám ngoại trú"],
  ["626 triệu", "Quỹ bảo hiểm Y tế, trợ cấp"],
  ["11", "Bệnh viện và Phòng khám"],
  ["3.782", "Nhân sự y tế"],
  ["597", "Bác sĩ"],
  ["1.626", "Chỉ số chất lượng"],
  ["135", "Được cấp"],
];

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{
          uri: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/5e2bfa17-523f-4f3a-a3db-1178684a7896.png",
        }}
        style={styles.banner}
        resizeMode="cover"
      />

      <Text style={styles.sectionTitle}>TẦM NHÌN VÀ SỨ MỆNH</Text>
      <Text style={styles.paragraph}>
        Blooding DNA Testing hướng đến cung cấp dịch vụ y tế chất lượng cao, ứng
        dụng công nghệ hiện đại và quy trình xét nghiệm tiên tiến nhằm phục vụ
        sức khỏe cộng đồng.
      </Text>

      <Text style={styles.subtitle}>Tầm nhìn</Text>
      <Text style={styles.paragraph}>
        Phát triển hệ thống y tế hiện đại với đội ngũ y bác sĩ hàng đầu, đem lại
        dịch vụ chất lượng cao thông qua công nghệ tiên tiến và trải nghiệm khác
        biệt.
      </Text>

      <Text style={styles.subtitle}>Sứ mệnh</Text>
      <Text style={styles.paragraph}>
        Chăm sóc sức khỏe toàn diện, tận tâm và hiệu quả với sự chuyên nghiệp và
        tận tụy.
      </Text>

      <Image
        source={{
          uri: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d9599cee-4a78-485b-9b6b-79d0cbef292e.png",
        }}
        style={styles.introImage}
        resizeMode="cover"
      />

      <Text style={styles.sectionTitle}>Giá trị cốt lõi - C.A.R.E</Text>
      <View style={styles.grid}>
        {values.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.desc}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Năng lực Hệ thống</Text>
      <View style={styles.gridStat}>
        {stats.map(([value, label], idx) => (
          <View key={idx} style={styles.statCard}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

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
  introImage: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#00a9a4",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 6,
    color: "#333",
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 12,
  },
  card: {
    width: "48%",
    backgroundColor: "#f7f7f7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  icon: {
    fontSize: 24,
    marginBottom: 6,
  },
  cardTitle: {
    fontWeight: "700",
    color: "#007bb8",
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: "#444",
  },
  gridStat: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 12,
  },
  statCard: {
    width: "48%",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#e0f7f6",
    marginBottom: 12,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00a9a4",
  },
  statLabel: {
    fontSize: 13,
    color: "#444",
    textAlign: "center",
    marginTop: 4,
  },
});
