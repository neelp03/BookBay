import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Ubuntu_400Regular, Ubuntu_700Bold } from '@expo-google-fonts/ubuntu';
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/provider/AuthProvider";
import { BookProvider } from "./src/provider/BookProvider";
import { UserProvider } from "./src/provider/UserProvider";
import { ThemeProvider } from "react-native-rapi-ui";

SplashScreen.preventAutoHideAsync();  // Prevent auto-hiding the splash screen

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded, error] = useFonts({
    Ubuntu_400Regular,
    Ubuntu_700Bold,
  });

  const images = [
    require("./assets/icon.png"),
    require("./assets/splash.png"),
    require("./assets/login.png"),
    require("./assets/register.png"),
    require("./assets/forget.png"),
  ];


  useEffect(() => {
    async function prepare() {
      // Prevent auto-hiding the splash screen
      await SplashScreen.preventAutoHideAsync();

      if (!fontsLoaded) {
        console.log('Fonts are not loaded:', error);
        setTimeout(() => {
          console.log("Font loading error", "Unable to load fonts, continuing without them.");
          setAppIsReady(true);
        }, 5000);
      } else {
        console.log('Fonts are loaded');
        setAppIsReady(true);
      }
    }

    prepare();
  }, [fontsLoaded]);

  useEffect(() => {
    if (appIsReady && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady, fontsLoaded]);

  if (!appIsReady || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }


  return (
    <ThemeProvider images={images}>
      <AuthProvider>
        <BookProvider>
          <UserProvider>
            <AppNavigator />
          </UserProvider>
        </BookProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
