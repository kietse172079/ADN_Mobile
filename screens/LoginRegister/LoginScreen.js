import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { loginUser, loginWithGogle } from "../../services/apiAuth";
import { useDispatch } from "react-redux";
import { login } from "../../feartures/user/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "../../theme/theme";
import { CustomButton } from "../../components/Button";
import { GoogleSignin, GoogleSigninButton } from "@react-native-google-signin/google-signin";
// import { useNavigation } from "@react-navigation/native";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const response = await loginUser(email, password);
      console.log(response.data);
      const token = response.data.token;
      if (token) {
        await AsyncStorage.setItem("accessToken", token);
        dispatch(login(token));
        Alert.alert(
          "Đăng nhập thành công!",
          `Chào mừng: ${response.data.user?.name || "người dùng"}`
        );
        // navigation.navigate("Home");
      } else {
        Alert.alert("Đăng nhập thất bại", "Vui lòng kiểm tra lại thông tin");
      }
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message || // lỗi trả về từ server
        err.message || // lỗi chung
        "Đã xảy ra lỗi không xác định";

      Alert.alert("Đăng nhập thất bại", errorMessage);
    }
  };

  // google sign in
  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      const id_token = userInfo.idToken;

      const response = await loginWithGogle(id_token);
      const token =
        response.data?.accessToken || response.token || response.data?.token;

      await AsyncStorage.setItem("accessToken", token);
      dispatch(login({ token }));

      Alert.alert(
        "Đăng nhập thành công!",
        `Chào mừng: ${response.data?.user?.name || "người dùng"}`
      );

      navigation.navigate("Home");
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Đăng nhập thất bại",
        error.response?.data?.message || "Vui lòng thử lại sau"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ĐĂNG NHẬP </Text>
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

      <View >
        <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={handleGoogleSignIn}
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
