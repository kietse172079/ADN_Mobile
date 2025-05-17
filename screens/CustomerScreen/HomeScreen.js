import React, { useContext } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../feartures/user/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "../../theme/theme";
import { CustomButton } from "../../components/Button";

export default function HomeScreen() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  // const navigation = useNavigation();

  const handleLogout = async () => {
    dispatch(logout());
    await AsyncStorage.removeItem("accessToken");
    // navigation.navigate("Login");
    Alert.alert("Đăng xuất thành công");
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Home</Text>
      <Text style={styles.subtitle}>You are logged in!</Text>
      <CustomButton title="Logout" onPress={handleLogout} type="primary" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.large,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.medium,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: theme.spacing.large,
  },
});
