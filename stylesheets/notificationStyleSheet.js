import { StyleSheet } from "react-native";

export const notificationStyles = StyleSheet.create({
  notificationCard: {
    width: 260,
    height: 250,
    bottom: 62,
    borderRadius: 20,
    position: "absolute",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(105, 105, 105, 0.5)",
  },
  firstChild: {
    width: 250,
    bottom: 54,
  },
  lastChild: {
    width: 270,
    bottom: 70,
  },
});
