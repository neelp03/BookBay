import messaging from '@react-native-firebase/messaging';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  return authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
}

function onMessageReceived(callback) {
  return messaging().onMessage(async remoteMessage => {
    callback(remoteMessage);
  });
}

export { requestUserPermission, onMessageReceived };
