/**
 * @file TaskItemStyles.ts
 *
 * This file contains the styles for the TaskItem component,
 * defining the layout and appearance of a single task item.
 */
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 8,
    marginVertical: 6,
    padding: 8,
    alignItems: "center",
    zIndex: 1000,
  },
  dragHandle: {
    marginRight: 6,
    paddingHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  taskArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  textArea: {
    flex: 1, // allows the text container to use the remaining space
    marginLeft: 4,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    flexWrap: "wrap", // wrap text to next line if it's too long
    flexShrink: 1, // allow the text to shrink if needed
  },
  dueDate: {
    fontSize: 12,
    opacity: 0.7,
  },
});
