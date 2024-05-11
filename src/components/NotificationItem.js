import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, themeColor, Text } from 'react-native-rapi-ui';

const NotificationItem = ({ icon, title, read, subtitle, time, onPress }) => {
  const { isDarkmode } = useTheme();

  const unreadBackgroundColor = isDarkmode ? themeColor.dark200 : themeColor.white;
  const readBackgroundColor = isDarkmode ? themeColor.dark200 : themeColor.white200;

  const utcToLocal = (utcDate) => {
    const date = new Date(utcDate);
    return date.toLocaleString();
  };

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: read ? readBackgroundColor : unreadBackgroundColor }]} onPress={onPress}>
      <View style={styles.iconContainer}>
        {icon}
        {!read && <View style={styles.unreadIndicator} />}
      </View>
      <View style={styles.textContainer}>
        <Text size="lg" fontWeight='bold'>{title}</Text>
        <Text fontWeight="light" style={{color: isDarkmode ? themeColor.white200 : themeColor.gray500}}>{subtitle}</Text>
      </View>
      <Text style={{...styles.timeText, color: isDarkmode ? themeColor.gray100 : themeColor.gray300}}>{utcToLocal(time)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  iconContainer: {
    width: 50,
    height: 50,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    position: 'relative',
    backgroundColor: themeColor.warning400,
  },
  textContainer: {
    flex: 1,
    paddingBottom: 15
  },
  timeText: {
    position: 'absolute',
    bottom: 5,
    right: 10,
    fontSize: 12,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    position: 'absolute',
    top: 5,
    right: 5,
  },
});

export default NotificationItem;
