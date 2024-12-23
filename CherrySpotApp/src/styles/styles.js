// Rev 2
// File: src/styles/styles.js

import { StyleSheet } from "react-native";
import { appConfig } from "../config";

// Define color palette
const colors = {
  background: "#0D0D0D",
  primary: "#FADB17",
  secondary: "#081E3E",
  text: "#735F25",
};

const baseText = {
  fontFamily: appConfig.fontFamily,
};

const styles = StyleSheet.create({
  // Container styles
  container: { flex: 1, padding: 10, backgroundColor: colors.background },

  // Video card styles
  videoCard: { flexDirection: "row", marginBottom: 10, backgroundColor: colors.secondary, borderRadius: 10, padding: 10 },
  thumbnail: { width: 120, height: 90, marginRight: 15, borderRadius: 10 },
  info: { flex: 1 },
  channelTitle: { ...baseText, fontSize: 22, fontWeight: "bold", color: colors.primary, marginBottom: 5 },
  description: { fontSize: 18, color: colors.text, marginBottom: 12 },
  stats: { flexDirection: "row", marginBottom: 5 },
  statText: { fontSize: 11, color: colors.primary, marginRight: 10 },

  // Header styles
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 1, marginTop: 30 },
  headerTitle: { ...baseText, fontSize: 72, color: colors.primary, fontWeight: "bold", marginBottom: 10, marginTop: 15, marginLeft: 10, },
  headerIcons: { flexDirection: "row", marginTop: 10, marginBottom: 10 },

  // Options container styles
  optionsContainer: { backgroundColor: colors.secondary, padding: 15, borderRadius: 10, marginBottom: 30 },
  optionText: {color: colors.primary, fontSize: 16, marginBottom: 15, marginTop: 15, textDecorationLine: "underline" },
});

export default styles;
