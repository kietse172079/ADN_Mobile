import React from "react";
import { ScrollView, View, Text, Image, StyleSheet } from "react-native";

export default function GuideScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* <Image
        source={{
          uri: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/943ee253-c991-4ef1-810e-386876d92a70.png",
        }}
        style={styles.heroImage}
        resizeMode="cover"
      /> */}
      <Text style={styles.heroText}>
        Hướng dẫn xét nghiệm & Bảng giá dịch vụ ADN
      </Text>

      <View style={styles.section}>
        <Text style={styles.heading}>Xét nghiệm ADN cha con là gì?</Text>
        <Text style={styles.paragraph}>
          Là phương pháp phân tích ADN từ mẫu sinh học như máu, tóc, móng tay,
          nước miếng... để xác định mối quan hệ huyết thống chính xác.
        </Text>
        <Image
          source={{
            uri: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/54d79a15-f6c9-4372-b534-5da64639b1e4.png",
          }}
          style={styles.sectionImage}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Bảng giá xét nghiệm ADN</Text>
        {[
          {
            name: "Di truyền cơ bản",
            desc: "Kiểm tra bệnh di truyền",
            price: "1.500.000 VND",
          },
          {
            name: "Sức khỏe toàn diện",
            desc: "Phân tích nguy cơ sức khỏe",
            price: "3.500.000 VND",
          },
          {
            name: "Nguồn gốc tổ tiên",
            desc: "Truy xuất dân tộc",
            price: "1.800.000 VND",
          },
          {
            name: "Dược di truyền",
            desc: "Phản ứng với thuốc",
            price: "2.500.000 VND",
          },
          {
            name: "Nguy cơ ung thư",
            desc: "Đánh giá gen ung thư",
            price: "4.000.000 VND",
          },
        ].map((item, index) => (
          <View key={index} style={styles.priceRow}>
            <Text style={styles.priceTitle}>{item.name}</Text>
            <Text style={styles.priceDesc}>{item.desc}</Text>
            <Text style={styles.price}>{item.price}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Quy trình lấy mẫu</Text>
        <Text style={styles.paragraph}>
          Mẫu sinh học bao gồm máu, tóc chânchân, nước miếng… đảm bảo nhanh
          chóng và an toàn.
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            {
              label: "Máu",
              uri: "https://medlatec.vn/media/17853/content/20190901_xet-nghiem-mau-01.jpg",
            },
            {
              label: "Tóc chân",
              uri: "https://novagen.vn/wp-content/uploads/2024/08/lay-mau-toc-de-xet-nghiem-adn-tai-nha-can-chu-y-nhung-gi-3.jpg",
            },
            // {
            //   label: "Móng tay",
            //   uri: "https://trungtamxetnghiem.vn/wp-content/uploads/2023/04/xet-nghiem-adn-bang-mong-tay.png",
            // },
            {
              label: "Nước miếng",
              uri: "https://www.vinmec.com/static/uploads/small_20191205_082545_521741_D_Na_nuoc_bot_2_max_1800x1800_png_b09c64bfb1.png",
            },
          ].map(({ label, uri }, index) => (
            <View key={index} style={styles.sampleItem}>
              <Image source={{ uri }} style={styles.sampleImage} />
              <Text style={styles.sampleText}>{label}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const PRIMARY_COLOR = "#00a9a4";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  heroImage: {
    height: 220,
    borderRadius: 12,
    marginBottom: 12,
  },
  heroText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: PRIMARY_COLOR,
    marginBottom: 20,
  },
  section: { marginBottom: 24 },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginBottom: 8,
  },
  paragraph: { fontSize: 15, lineHeight: 22, marginBottom: 10 },
  sectionImage: {
    height: 180,
    borderRadius: 10,
    marginTop: 10,
  },
  priceRow: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 8,
  },
  priceTitle: { fontWeight: "bold", color: PRIMARY_COLOR },
  priceDesc: { fontSize: 14 },
  price: { fontSize: 15, color: PRIMARY_COLOR, fontWeight: "600" },
  sampleItem: {
    alignItems: "center",
    marginRight: 16,
    width: 100,
  },
  sampleImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginBottom: 6,
  },
  sampleText: {
    textAlign: "center",
    fontSize: 13,
    color: PRIMARY_COLOR,
    fontWeight: "600",
  },
});
