module.exports = {
  preset: "react-native",
  setupFiles: ["<rootDir>/jest.setup.js"],
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|react-native-reanimated|react-native-paper)/)",
  ],
  moduleNameMapper: {
    // stub out native animated helper so React Native’s native Animated driver doesn’t schedule real timers
    "^react-native/Libraries/Animated/NativeAnimatedHelper$":
      "<rootDir>/__mocks__/NativeAnimatedHelper.js",
  },
};
