import React from "react";
import {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { allNotifications } from "../constants/notifications";
import Notification from "../components/Notification";
import { notificationStyles } from "../stylesheets/notificationStyleSheet";

export default function App() {
  const pressed = useSharedValue(false);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const scale = useSharedValue(1);

  const [notifications, setNotifications] = React.useState(allNotifications);

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
          duration: 800,
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
        duration: 800,
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
      : {
          transform: [
            {
              scaleX: withTiming(1, {
                duration: 300,
                easing: Easing.cubic,
              }),
            },
          ],
        }
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
    <>
      {notifications.map((notificationData, index) =>
        index === notifications.length - 1 ? (
          <GestureDetector gesture={pan} key={notificationData.id}>
            <Notification
              notificationData={notificationData}
              style={[
                notificationStyles.notificationCard,
                lastItemAnimatedStyles,
                notificationStyles.lastChild,
              ]}
            />
          </GestureDetector>
        ) : (
          <Notification
            notificationData={notificationData}
            style={[
              notificationStyles.notificationCard,
              ...(index === 0
                ? [notificationStyles.firstChild, firstItemAnimatedStyles]
                : []),
            ]}
            key={notificationData.id}
          />
        )
      )}
    </>
  );
}
