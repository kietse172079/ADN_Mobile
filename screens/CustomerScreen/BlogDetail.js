import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import useBlog from "../../hooks/useBlog";

const BlogDetail = () => {
  const route = useRoute();
  const { slug } = route.params;
  const { fetchBlogDetail } = useBlog();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchBlogDetail(slug);
      if (res.success) setBlog(res.data);
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  if (loading)
    return (
      <ActivityIndicator
        style={{ marginTop: 50 }}
        size="large"
        color="#00a9a4"
      />
    );

  if (!blog)
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy bài viết.</Text>
      </View>
    );

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={styles.container}
    >
      <Text style={styles.title}>{blog.title}</Text>
      <Text style={styles.dateText}>
        {blog.created_at
          ? new Date(blog.created_at).toLocaleDateString("vi-VN")
          : ""}
      </Text>

      <Image
        source={{
          uri: blog.images?.[0]?.image_url || "https://picsum.photos/600",
        }}
        style={styles.image}
      />

      <Text style={styles.content}>{blog.content}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00a9a4",
    marginBottom: 6,
  },
  dateText: {
    fontSize: 13,
    color: "#888",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#eee",
  },
  content: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    textAlign: "justify",
  },
  errorContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
  },
  scrollContent: {
    paddingBottom: 100, // khoảng tránh đủ để không bị che
  },
});

export default BlogDetail;
