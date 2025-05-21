import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "../screens/LoginRegister/LoginScreen";
import HomeScreen from "../screens/CustomerScreen/HomeScreen";
import { useDispatch, useSelector } from "react-redux";
import RegisterScreen from "../screens/LoginRegister/RegisterScreen";
import WelcomeScreen from "../screens/LoginRegister/WelcomeScreen";
import Ionicons from "react-native-vector-icons/Ionicons";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// function HomeStack() {
//   return (
//     <Stack.Navigator initialRouteName="Home">
//       <Stack.Screen name="Home" component={HomeScreen} />
//     </Stack.Navigator>
//   );
// }
function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "Profile")
            iconName = focused ? "person" : "person-outline";
          else if (route.name === "Schedule")
            iconName = focused ? "calendar" : "calendar-outline";
          else if (route.name === "Notifications")
            iconName = focused ? "notifications" : "notifications-outline";
          else if (route.name === "Account")
            iconName = focused ? "settings" : "settings-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={HomeScreen} />
      <Tab.Screen name="Schedule" component={HomeScreen} />
      <Tab.Screen name="Notifications" component={HomeScreen} />
      <Tab.Screen name="Account" component={HomeScreen} />
    </Tab.Navigator>
  );
}

export default function Navigator() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        dispatch(login({ token }));
      }
    };
    checkLogin();
  }, []);
  return (
    <NavigationContainer>
      {isLoggedIn ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
