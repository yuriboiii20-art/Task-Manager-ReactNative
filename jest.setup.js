import "react-native-gesture-handler/jestSetup";

// Silence the warning: “An update to Animated... was not wrapped in act(...)”
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");
