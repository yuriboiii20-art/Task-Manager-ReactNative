import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Redirect } from "expo-router";
import { styles } from "../styles/IndexStyles";

/**
 * Splash screen component for the app, displayed for 3 seconds before redirecting to the home screen.
 */
export default function Index() {
  const [redirect, setRedirect] = useState(false);

  // Set a timer to redirect after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setRedirect(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Navigate to home screen
  if (redirect) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Manager</Text>
      <Text style={styles.subtitle}>Stay Organized, Stay Ahead 🚀</Text>
    </View>
  );
}
