// hooks/useBlog.js
import { useDispatch, useSelector } from "react-redux";
import { searchBlogs, getBlogBySlug } from "../feartures/blogSlice/blogSlice";
import { useCallback } from "react";

const useBlog = () => {
  const dispatch = useDispatch();
  const { blogs, total, loading, blogDetail, error } = useSelector(
    (state) => state.blog
  );

  const fetchBlogs = useCallback(
    (payload) => {
      dispatch(searchBlogs(payload));
    },
    [dispatch]
  );

  const fetchBlogDetail = async (slug) => {
    try {
      const res = await dispatch(getBlogBySlug(slug)).unwrap();
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, message: "Không thể lấy bài viết" };
    }
  };

  return {
    blogs,
    total,
    loading,
    blogDetail,
    error,
    fetchBlogs,
    fetchBlogDetail,
  };
};

export default useBlog;
