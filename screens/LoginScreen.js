import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { theme } from "../theme/theme";
import { CustomButton } from "../components/Button";
import { AuthContext } from "../navigation/Navigator";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useContext(AuthContext);

  const handleLogin = () => {
    if (email && password) {
      Alert.alert("Success", "Logged in successfully!");
      signIn(); // Sử dụng hàm signIn từ context
    } else {
      Alert.alert("Error", "Please fill in all fields");
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
