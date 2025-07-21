import React from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import { theme } from "../../theme/theme";
import { CustomButton } from "../../components/Button";
import { useDispatch } from "react-redux";
import { login } from "../../feartures/user/authSlice";

export default function WelcomeScreen({ navigation }) {
  const dispatch = useDispatch();

  const handleGoToHome = () => {
    // Dispatch action login để chuyển sang AppTabs
    dispatch(login({ token: "dummy_token" }));
  };
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image
          source={require("../../assets/DNA.jpg")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Bắt đầu"
          onPress={() => navigation.navigate("Login")}
          type="primary"
        />
      </View>
      {/* <View style={styles.buttonContainer}>
        <CustomButton
          title="Vào trang Home"
          onPress={handleGoToHome}
          type="primary"
        />
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.large,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: theme.spacing.large,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: theme.spacing.large * 2,
  },
});
