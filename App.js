import NotificationStack from "./containers/NotificationStack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { commonStyles } from "./stylesheets/commonStyleSheet";

export default function App() {
  return (
    <GestureHandlerRootView style={commonStyles.screen}>
      <NotificationStack />
    </GestureHandlerRootView>
  );
}
