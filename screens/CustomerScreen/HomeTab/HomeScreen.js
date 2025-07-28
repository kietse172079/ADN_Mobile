import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";
import useBlog from "../../../hooks/useBlog";
import { theme } from "../../../theme/theme";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function HomeScreen({ navigation }) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { blogs, loading, fetchBlogs } = useBlog();

  useEffect(() => {
    fetchBlogs({
      pageNum: 1,
      pageSize: 10,
      is_published: true,
    });
  }, []);

  const mainFeatures = [
    {
      id: "1",
      title: "Giới thiệu",
      icon: "information-circle",
      screen: "About",
    },
    { id: "2", title: "Hướng dẫn", icon: "book", screen: "Guide" },
    { id: "3", title: "Tin tức", icon: "newspaper", screen: "HomeWeb" },
  ];

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/DNA.jpg")}
        style={styles.banner}
        resizeMode="cover"
      />

      <View style={styles.mainFeaturesWrapper}>
        <FlatList
          data={mainFeatures}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Ionicons
                name={item.icon}
                size={30}
                color="#000"
                style={styles.featureIcon}
              />
              <Text style={styles.featureText}>{item.title}</Text>
            </TouchableOpacity>
          )}
          style={styles.featuresContainer}
        />
      </View>

      <Text style={styles.blogSectionTitle}>Bài viết mới</Text>
      <FlatList
        data={blogs}
        keyExtractor={(item) => item._id?.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.blogCard}
            onPress={() =>
              navigation.navigate("BlogDetail", { slug: item.slug })
            }
          >
            <Image
              source={
                item.images?.[0]?.image_url
                  ? { uri: item.images[0].image_url }
                  : require("../../../assets/DNA.jpg")
              }
              style={styles.blogImage}
            />
            <View style={styles.blogTextContainer}>
              <Text style={styles.blogTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text numberOfLines={2} style={styles.blogDescription}>
                {item.description}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          loading ? (
            <Text style={{ textAlign: "center" }}>Đang tải bài viết...</Text>
          ) : (
            <Text style={{ textAlign: "center" }}>Không có bài viết nào</Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.medium,
  },
  banner: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    marginBottom: theme.spacing.medium,
  },
  mainFeaturesWrapper: {
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.medium,
  },
  featuresContainer: {
    marginVertical: theme.spacing.medium,
  },
  featureCard: {
    backgroundColor: "#E0F7F6",
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.small,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: theme.spacing.small,
    width: 90,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureIcon: {
    marginBottom: theme.spacing.small,
  },
  featureText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.primary,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.small,
  },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.small,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: theme.spacing.medium,
    backgroundColor: "#eee",
  },
  serviceTextContainer: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  serviceSubtitle: {
    fontSize: 13,
    color: "#666",
  },
  blogSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00a9a4",
    marginVertical: 12,
  },
  blogCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  blogImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  blogTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  blogTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  blogDescription: {
    fontSize: 14,
    color: "#666",
  },
});
