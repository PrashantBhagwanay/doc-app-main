

import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  SafeAreaView,
  StatusBar,
  Platform,
  View,
} from "react-native";

import SplashScreen from "./Login/Screens/SpalshScreens/SplashScreen";
// import LoginScreen from "./Login/onBoardScreen";
// import LogScreen from "./Login/LoginScreen";
import SignupScreen from "./Login/Screens/Signup/SignupScreen";
import Dashboard from "./Login/Screens/Dashboard/Dashboard";
import VisitingCardForm from "./Login/Screens/VisitingCard/VisitingCardForm";
import SuccessScreen from "./Login/Screens/Success/SuccessScreen";
import SavedCards from "./Login/Screens/SavedCards/SavedCards";
import CameraScreen from "./Login/CameraScreen";
import onBoardScreen from "./Login/Screens/Onboard/onBoardScreen";
import LoginScreen from "./Login/Screens/Login/LoginScreen";
import OnboardScreen from "./Login/Screens/Onboard/onBoardScreen";

export type RootStackParamList = {
  navigate(arg0: string): void;
  login: undefined;
  signup: undefined;
  onboard: undefined;
  VisitingCardForm: { imageUrl: any; clinicData: any; location: any };
};

const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2800);
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isLoading ? (
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : (
            <>
                <Stack.Screen name="onboard" component={OnboardScreen} />
                <Stack.Screen name="login" component={LoginScreen} />
              <Stack.Screen name="signup" component={SignupScreen} />
              <Stack.Screen name="dashboard" component={Dashboard} />
              <Stack.Screen
                name="VisitingCardForm"
                component={VisitingCardForm}
              />
              <Stack.Screen name="success" component={SuccessScreen} />
              <Stack.Screen name="SavedCards" component={SavedCards} />
              <Stack.Screen name="CameraScreen" component={CameraScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;
