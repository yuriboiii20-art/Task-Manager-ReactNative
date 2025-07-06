import React, { useContext, useEffect } from "react";
import { TouchableOpacity, Alert, Platform, ToastAndroid } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolateColor,
} from "react-native-reanimated";

// Import custom styles and theme context
import { ThemeOverrideContext } from "../app/_layout";
import { TaskContext } from "../contexts/TaskContext";
import { styles } from "../styles/CustomTabBarStyles";
import usePrevious from "../hooks/usePrevious";

/**
 * CustomTabBar component serves as the custom bottom tab bar for the application,
 * @param props - BottomTabBarProps from @react-navigation/bottom-tabs
 */
export default function CustomTabBar(props: BottomTabBarProps) {
  const { state, navigation } = props;
  const { colors } = useTheme();
  const { colorSchemeOverride, setColorSchemeOverride } =
    useContext(ThemeOverrideContext);
  const { user, signOut } = useContext(TaskContext);

  // Animate background transitions
  const prevSurface = usePrevious(colors.surface) || colors.surface;

  // Shared value for animation progress
  const progress = useSharedValue(1);

  // Animate progress when colors.surface changes with duration 200ms
  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration: 200 });
  }, [colors.surface]);

  // Animated style that interpolates between the previous and current background color
  const animatedStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(
      progress.value,
      [0, 1],
      [prevSurface, colors.surface],
    );
    return { backgroundColor: bg };
  });

  /**
   * toggleTheme function toggles the color scheme override
   */
  const toggleTheme = () => {
    setColorSchemeOverride(colorSchemeOverride === "dark" ? "light" : "dark");
  };

  /**
   * renderTab function renders a single tab button
   *
   * @param routeName - the name of the route to navigate to
   * @param iconName - the name of the Ionicons icon to display
   * @param index - the index of the tab in the state
   */
  const renderTab = (
    routeName: string,
    iconName: keyof typeof Ionicons.glyphMap,
    index: number,
  ) => {
    const isFocused = state.index === index;
    const onPress = () => navigation.navigate(routeName as never);
    const color = isFocused ? colors.primary : (colors.onBackground ?? "#999");
    return (
      <TouchableOpacity
        key={routeName}
        onPress={onPress}
        style={styles.tabButton}
        activeOpacity={0.8}
      >
        <Ionicons name={iconName} size={24} color={color} />
      </TouchableOpacity>
    );
  };

  /**
   * handleLogout function handles user logout
   */
  const handleLogout = async () => {
    try {
      await signOut();
      const msg = "Logged out successfully.";
      if (Platform.OS === "android") ToastAndroid.show(msg, ToastAndroid.SHORT);
      else Alert.alert("", msg);
      navigation.navigate("signin" as never);
    } catch (e: any) {
      const err = e.message || "Logout failed.";
      if (Platform.OS === "android") ToastAndroid.show(err, ToastAndroid.LONG);
      else Alert.alert("Error", err);
    }
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {renderTab("home", "home", 0)}
      {renderTab("stats", "stats-chart", 1)}

      {user ? (
        // If signed in: show logout icon
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.tabButton}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out" size={24} color={colors.onBackground} />
        </TouchableOpacity>
      ) : (
        // If not signed in: ALWAYS show sign-in and register
        <>
          {renderTab("signin", "log-in", 2)}
          {renderTab("register", "person-add", 3)}
        </>
      )}

      {/* Theme Toggle */}
      <TouchableOpacity
        onPress={toggleTheme}
        style={styles.tabButton}
        activeOpacity={0.8}
      >
        <Ionicons
          name={colorSchemeOverride === "dark" ? "sunny" : "moon"}
          size={24}
          color={colors.onBackground ?? "#999"}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}
