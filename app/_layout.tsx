import React, {
  useState,
  useEffect,
  createContext,
  Dispatch,
  SetStateAction,
  useRef,
} from "react";
import {
  useColorScheme,
  ColorSchemeName,
  View,
  StyleSheet,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Slot } from "expo-router";
import {
  Provider as PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
} from "react-native-paper";
import * as NavigationBar from "expo-navigation-bar";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";

// Import custom color constants, hooks, and TaskProvider for task management
import { LightColors, DarkColors } from "../constants/Colors";
import { TaskProvider } from "../contexts/TaskContext";
import { styles } from "../styles/LayoutStyles";
import usePrevious from "../hooks/usePrevious";

// Create an animated version of SafeAreaView for smooth background animations
const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

// Create a context to manage theme overrides (dark/light mode)
export type TThemeOverride = {
  colorSchemeOverride: ColorSchemeName;
  setColorSchemeOverride: Dispatch<SetStateAction<ColorSchemeName>>;
};

// Initialize the ThemeOverrideContext with default values
export const ThemeOverrideContext = createContext<TThemeOverride>({
  colorSchemeOverride: undefined,
  setColorSchemeOverride: () => {},
});

/**
 * Layout component serves as the main layout for the application,
 * providing a theme context, safe area view, and task management.
 */
export default function Layout() {
  const systemColorScheme = useColorScheme();
  const [colorSchemeOverride, setColorSchemeOverride] =
    useState<ColorSchemeName>();

  // Set initial color scheme based on system preference
  useEffect(() => {
    if (!colorSchemeOverride) {
      setColorSchemeOverride(systemColorScheme);
    }
  }, [systemColorScheme]);

  // Determine the current theme based on the override or system preference
  const isDark = colorSchemeOverride === "dark";

  // Light theme configuration
  const LightTheme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: LightColors.primary,
      background: LightColors.background,
      surface: LightColors.surface,
      onBackground: LightColors.text,
    },
  };

  // Dark theme configuration
  const DarkTheme = {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: DarkColors.primary,
      background: DarkColors.background,
      surface: DarkColors.surface,
      onBackground: DarkColors.text,
    },
  };

  // Determine the current theme and device status bar's theme
  const currentTheme = isDark ? DarkTheme : LightTheme;
  const barStyle = isDark ? "light" : "dark";

  // Set up an animated transition for the background color for a smoother UX
  const prevBackground =
    usePrevious(currentTheme.colors.background) ||
    currentTheme.colors.background;
  const progress = useSharedValue(1);

  // Update the progress value when the background color changes
  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration: 200 });
    // Update device's navigation bar to match current background
    NavigationBar.setBackgroundColorAsync(currentTheme.colors.background);
  }, [currentTheme.colors.background]);

  // Create an animated style that interpolates between the previous and current background color
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [prevBackground, currentTheme.colors.background],
    ),
  }));

  // Render the layout with the current theme and animated background color
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={currentTheme}>
          <View style={{ flex: 1 }}>
            <AnimatedSafeAreaView
              style={[
                styles.safeArea,
                animatedStyle,
                { backgroundColor: currentTheme.colors.background },
              ]}
              edges={["top", "bottom", "left", "right"]}
            >
              <StatusBar style={barStyle} />
              <ThemeOverrideContext.Provider
                value={{ colorSchemeOverride, setColorSchemeOverride }}
              >
                <TaskProvider>
                  <Slot />
                </TaskProvider>
              </ThemeOverrideContext.Provider>
            </AnimatedSafeAreaView>
          </View>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
