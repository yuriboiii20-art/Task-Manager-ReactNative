/**
 * @file StatsScreenStyles.ts
 *
 * This file contains the styles for the StatsScreen component,
 * defining the layout and appearance of the statistics screen.
 */
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1 },
  headerArea: { alignItems: "center", marginTop: 16, marginBottom: 8 },
  heading: { fontSize: 28, fontWeight: "800", letterSpacing: 1.2 },
  subheading: { fontSize: 16, opacity: 0.7, marginBottom: 16 },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  topCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  topCard: {
    flex: 0.45,
    paddingVertical: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  topCardNumber: {
    fontSize: 32,
    fontWeight: "bold",
  },
  topCardLabel: {
    fontSize: 16,
    marginTop: 4,
  },
});
