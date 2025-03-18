/**
 * @file IndexStyles.ts
 *
 * This file contains the styles for the Index component,
 * defining the layout and appearance of the loading screen.
 */
import { StyleSheet, Dimensions } from "react-native";

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // covers the entire screen
    zIndex: 9999, // make sure it sits on top
    backgroundColor: "#fff", // or whichever background you prefer
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    marginTop: 10,
  },
});
