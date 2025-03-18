import React, { useContext, useEffect } from "react";
import { TouchableOpacity } from "react-native";
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

  // Get previous surface color to interpolate from
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

  // Toggle theme
  const toggleTheme = () => {
    setColorSchemeOverride(colorSchemeOverride === "dark" ? "light" : "dark");
  };

  // Render tab button
  const renderTab = (
    routeName: string,
    iconName: keyof typeof Ionicons.glyphMap,
    index: number,
  ) => {
    const isFocused = state.index === index;
    const onPress = () => {
      navigation.navigate(routeName as never);
    };
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

  // Render the custom tab bar with animated background color and the buttons
  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {renderTab("home", "home", 0)}
      {renderTab("stats", "stats-chart", 1)}

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
