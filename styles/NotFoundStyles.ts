/**
 * @file NotFoundStyles.ts
 *
 * This file contains the styles for the NotFound component,
 * defining the layout and appearance of the 404 Not Found page.
 */
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    marginBottom: 8,
  },
  subtext: {
    marginBottom: 12,
  },
  link: {
    fontSize: 16,
    color: "#6200EE",
  },
});
