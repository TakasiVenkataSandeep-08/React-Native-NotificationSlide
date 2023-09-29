import "react-native-gesture-handler";
import React from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

export default function App() {
  const pressed = useSharedValue(false);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const scale = useSharedValue(1);

  const [notifications, setNotifications] = React.useState([
    {
      imageSrc:
        "https://i.ibb.co/B4gb0HT/Screenshot-2023-09-21-at-11-31-15-AM.png",
      id: "notification_1",
      altText: "Weather",
    },
    {
      imageSrc:
        "https://i.ibb.co/tMhHdzr/Screenshot-2023-09-21-at-11-31-29-AM.png",
      id: "notification_2",
      altText: "Calendar",
    },
    {
      imageSrc:
        "https://i.ibb.co/qp4Y18N/Screenshot-2023-09-21-at-7-34-54-PM.png",
      id: "notification_3",
      altText: "Reminders",
    },
    {
      imageSrc:
        "https://i.ibb.co/ch46Cx5/Screenshot-2023-09-21-at-7-35-46-PM.png",
      id: "notification_4",
      altText: "Stocks",
    },
    {
      imageSrc:
        "https://i.ibb.co/qxcZb55/Screenshot-2023-09-21-at-7-35-57-PM.png",
      id: "notification_5",
      altText: "Share location",
    },
    {
      imageSrc:
        "https://i.ibb.co/s5n1Pdv/Screenshot-2023-09-21-at-11-14-51-AM.png",
      id: "notification_6",
      altText: "Event notifier",
    },
  ]);

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
      scale.value = withTiming(0.8, {
        duration: 300,
        easing: Easing.cubic,
      });
    })
    .onChange((event) => {
      offsetX.value = event.translationX;
      offsetY.value = event.translationY;
    })
    .onFinalize(() => {
      if (offsetX.value === 0 && offsetY.value === 0) {
        pressed.value = false;
        scale.value = withTiming(1, {
          duration: 1000,
          easing: Easing.cubic,
        });
        return;
      }
      const newNotifications = JSON.parse(JSON.stringify(notifications));
      const lastNotification = newNotifications.pop();
      newNotifications.unshift(lastNotification);
      runOnJS(setNotifications)(newNotifications);
      pressed.value = false;
      scale.value = withTiming(1, {
        duration: 1000,
        easing: Easing.cubic,
      });
      offsetX.value = withTiming(0, { duration: 1000 });
      offsetY.value = withTiming(0, { duration: 1000 });
    });

  const lastItemAnimatedStyles = useAnimatedStyle(() =>
    pressed.value
      ? {
          transform: [
            {
              translateX: offsetX.value,
            },
            {
              translateY: offsetY.value,
            },
            {
              scale: scale.value,
            },
          ],
        }
      : {}
  );
  const firstItemAnimatedStyles = useAnimatedStyle(() =>
    !pressed.value
      ? {
          transform: [
            {
              translateX: offsetX.value,
            },
            {
              translateY: offsetY.value,
            },
            {
              scale: scale.value,
            },
          ],
        }
      : {}
  );

  return (
    <GestureHandlerRootView style={styles.screen}>
      {notifications.map((notificationData, index) =>
        index === notifications.length - 1 ? (
          <GestureDetector gesture={pan} key={notificationData.id}>
            <Animated.Image
              source={{
                url: notificationData.imageSrc,
              }}
              id={notificationData.id}
              alt={notificationData.altText}
              style={[
                styles.notificationCard,
                lastItemAnimatedStyles,
                styles.lastChild,
              ]}
            />
          </GestureDetector>
        ) : (
          <Animated.Image
            source={{
              url: notificationData.imageSrc,
            }}
            id={notificationData.id}
            key={notificationData.id}
            alt={notificationData.altText}
            style={[
              styles.notificationCard,
              ...(index === 0
                ? [styles.firstChild, firstItemAnimatedStyles]
                : []),
            ]}
          />
        )
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: "relative",
    backgroundColor: "#c71517",
  },
  notificationCard: {
    width: 260,
    height: 250,
    bottom: 62,
    borderRadius: 20,
    position: "absolute",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00000033",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
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
