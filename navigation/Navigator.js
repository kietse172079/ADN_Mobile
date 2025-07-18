import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "../screens/LoginRegister/LoginScreen";
import HomeScreen from "../screens/CustomerScreen/HomeScreen";
import { useDispatch, useSelector } from "react-redux";
import RegisterScreen from "../screens/LoginRegister/RegisterScreen";
import WelcomeScreen from "../screens/LoginRegister/WelcomeScreen";
import ProfileScreen from "../screens/CustomerScreen/ProfileScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login, logout } from "../feartures/user/authSlice";
import apiClient from "../services/apiClient";
import API from "../services/apiConfig";
import DetailService from "../screens/CustomerScreen/DetailService";
import CreateAppointment from "../screens/CustomerScreen/CreateAppointment";
import ViewAppointmentschedulelist from "../screens/CustomerScreen/ViewAppointmentschedulelist";
import AppointmentDetail from "../screens/CustomerScreen/AppointmentDetail";
import ViewSampleAppointment from "../screens/CustomerScreen/ViewSampleAppointment"; 

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth stack cho login/register
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
      <Stack.Screen
        name="DetailService"
        component={DetailService}
        options={{ title: "Chi tiết dịch vụ" }}
      />
    </Stack.Navigator>
  );
}

// HomeStack cho tab Trang chủ
const HomeStackNav = createStackNavigator();
function HomeStack() {
  return (
    <HomeStackNav.Navigator>
      <HomeStackNav.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStackNav.Screen
        name="DetailService"
        component={DetailService}
        options={{ title: "Chi tiết dịch vụ" }}
      />
      <HomeStackNav.Screen
        name="CreateAppointment"
        component={CreateAppointment}
        options={{ title: "Đặt lịch hẹn" }}
      />
      <HomeStackNav.Screen
        name="AppointmentDetail"
        component={AppointmentDetail}
        options={{ title: "Chi tiết lịch hẹn" }}
      />
    </HomeStackNav.Navigator>
  );
}

// AppointmentStack cho tab Lịch
const AppointmentStackNav = createStackNavigator();
function AppointmentStack() {
  return (
    <AppointmentStackNav.Navigator>
      <AppointmentStackNav.Screen
        name="ViewAppointmentschedulelist"
        component={ViewAppointmentschedulelist}
        options={{ headerShown: false }}
      />
      <AppointmentStackNav.Screen
        name="AppointmentDetail"
        component={AppointmentDetail}
        options={{ title: "Chi tiết lịch hẹn" }}
      />
      <AppointmentStackNav.Screen
        name="ViewSampleAppointment"
        component={ViewSampleAppointment}
        options={{ title: "Danh sách mẫu" }}
      />
    </AppointmentStackNav.Navigator>
  );
}

// Tabs chính
function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Trang chủ")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "Dịch vụ")
            iconName = focused ? "construct" : "construct-outline";
          else if (route.name === "Lịch")
            iconName = focused ? "calendar" : "calendar-outline";
          else if (route.name === "Thông báo")
            iconName = focused ? "notifications" : "notifications-outline";
          else if (route.name === "Tài khoản")
            iconName = focused ? "person" : "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#00a9a4",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Trang chủ"
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Dịch vụ"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Lịch"
        component={AppointmentStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Thông báo"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Tài khoản"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default function Navigator() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (token) {
          const response = await apiClient.get(API.LOGIN, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const user =
            response.data.data || response.data.user || response.data;
          dispatch(login({ token, user }));
        } else {
          dispatch(logout());
        }
      } catch (err) {
        console.error("Login check error:", err);
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, [dispatch]);

  if (loading) {
    return null; // Hoặc hiển thị loading indicator
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}