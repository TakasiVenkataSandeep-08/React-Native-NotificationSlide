import Animated from "react-native-reanimated";

export default function Notification({ notificationData, style }) {
  return (
    <Animated.Image
      source={{
        url: notificationData.imageSrc,
      }}
      id={notificationData.id}
      alt={notificationData.altText}
      style={style}
    />
  );
}
