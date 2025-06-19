import React, { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, Button } from "react-native";
import { loginUser, loginWithGoogle } from "../../services/apiAuth";
import { useDispatch } from "react-redux";
import { login } from "../../feartures/user/authSlice"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "../../theme/theme";
import { CustomButton } from "../../components/Button";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const response = await loginUser(email, password);
      // console.log("Login response:", response);

      const token = response.data.token;
      if (token) {
        await AsyncStorage.setItem("accessToken", token); // Lưu token với key "accessToken"
        dispatch(login({ token })); // Dispatch chỉ token vì user không có
        Alert.alert(
          "Đăng nhập thành công!",
          `Chào mừng người dùng`
        );
        navigation.navigate("Home"); // Điều hướng sau khi đăng nhập thành công
      } else {
        Alert.alert("Đăng nhập thất bại", "Vui lòng kiểm tra lại thông tin");
      }
    } catch (err) {
      console.error("Login error:", err);
      Alert.alert("Đăng nhập thất bại", err.message || "Vui lòng thử lại");
    }
  };

  const redirectUri = makeRedirectUri({ useProxy: true });

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "185593884375-6r969vepg1t07lj9qe9j8p05bjkebrpk.apps.googleusercontent.com",
    redirectUri: redirectUri,
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success") {
      const getUserInfoAndLogin = async () => {
        try {
          const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
            headers: {
              Authorization: `Bearer ${response.authentication.accessToken}`,
            },
          });
          const user = await res.json();
          console.log("Google user:", user);

          const backendResponse = await loginWithGoogle(user.id);

          const token = backendResponse.token;
          await AsyncStorage.setItem("accessToken", token);

          dispatch(login({ token }));

          Alert.alert("Đăng nhập Google thành công!");
          navigation.navigate("Home");
        } catch (error) {
          console.error("Google login flow error:", error);
          Alert.alert("Đăng nhập Google thất bại", "Vui lòng thử lại sau.");
        }
      };

      getUserInfoAndLogin();
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ĐĂNG NHẬP</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Nhập mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <CustomButton title="ĐĂNG NHẬP" onPress={handleLogin} type="primary" />
        <View style={styles.buttonSpacer} />
        <CustomButton
          title="TRỞ VỀ"
          onPress={() => navigation.navigate("Welcome")}
          type="secondary"
        />
      </View>

      <View>
        <Button
          title="Login with Google"
          disabled={!request}
          onPress={() => promptAsync()}
        />
      </View>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>
          Bạn chưa có tài khoản?{" "}
          <Text
            style={styles.registerLink}
            onPress={() => navigation.navigate("Register")}
          >
            Đăng ký ngay
          </Text>
        </Text>
      </View>
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
    marginBottom: theme.spacing.large,
  },
  input: {
    width: "100%",
    padding: theme.spacing.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 5,
    marginBottom: theme.spacing.medium,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  buttonSpacer: {
    height: theme.spacing.medium,
  },
  registerContainer: {
    marginTop: theme.spacing.large,
    alignItems: "center",
  },
  registerText: {
    color: theme.colors.text,
    fontSize: 14,
  },
  registerLink: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
});