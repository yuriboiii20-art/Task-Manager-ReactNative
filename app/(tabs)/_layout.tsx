import React from "react";
import { Tabs } from "expo-router";

// Import the custom tab bar component for styling and functionality
import CustomTabBar from "../../components/CustomTabBar";

/**
 * Layout for the app AFTER the splash screen is displayed,
 * which includes the tab navigation for the home and stats screens.
 */
export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="home"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="stats" options={{ title: "Stats" }} />
    </Tabs>
  );
}
