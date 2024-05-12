// Import necessary React components and hooks
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, themeColor, Text } from 'react-native-rapi-ui';

/**
 * NotificationItem component displays a single notification item with an icon,
 * title, subtitle, and the time the notification was received.
 * The background color changes based on whether the notification is read or unread.
 * 
 * @param {element} icon - Icon to display for the notification.
 * @param {string} title - Title text of the notification.
 * @param {boolean} read - Boolean indicating whether the notification has been read.
 * @param {string} subtitle - Subtitle text providing more details about the notification.
 * @param {string} time - Time the notification was received, in UTC.
 * @param {function} onPress - Function to execute when the notification is pressed.
 */
const NotificationItem = ({ icon, title, read, subtitle, time, onPress }) => {
  // Access the theme context to handle light/dark mode
  const { isDarkmode } = useTheme();

  // Define background colors for read and unread notifications based on theme
  const unreadBackgroundColor = isDarkmode ? themeColor.dark200 : themeColor.white;
  const readBackgroundColor = isDarkmode ? themeColor.dark200 : themeColor.white200;

  // Convert UTC date/time string to a localized string
  const utcToLocal = (utcDate) => {
    const date = new Date(utcDate);
    return date.toLocaleString();
  };

  // Render the notification item as a touchable row
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: read ? readBackgroundColor : unreadBackgroundColor }]} 
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        {icon}  // Display the notification icon
        {!read && <View style={styles.unreadIndicator} />}  // Show an unread indicator if the notification is not read
      </View>
      <View style={styles.textContainer}>
        <Text size="lg" fontWeight='bold'>{title}</Text>  // Display the title in bold
        <Text fontWeight="light" style={{color: isDarkmode ? themeColor.white200 : themeColor.gray500}}>{subtitle}</Text>  // Display the subtitle
      </View>
      <Text style={{...styles.timeText, color: isDarkmode ? themeColor.gray100 : themeColor.gray300}}>{utcToLocal(time)}</Text>  // Display the localized time of the notification
    </TouchableOpacity>
  );
};

// StyleSheet to style the NotificationItem component
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',  // Layout children in a row
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',  // Align children vertically in the center
    marginHorizontal: 10,  // Horizontal margin
    marginVertical: 5,  // Vertical margin
  },
  iconContainer: {
    width: 50,
    height: 50,
    marginRight: 10,
    justifyContent: 'center',  // Center content horizontally
    alignItems: 'center',  // Center content vertically
    borderRadius: 10,
    position: 'relative',  // Required for positioning the unread indicator
    backgroundColor: themeColor.warning400,  // Background color for the icon container
  },
  textContainer: {
    flex: 1,  // Take up remaining space
    paddingBottom: 15
  },
  timeText: {
    position: 'absolute',  // Position the time text absolutely within the container
    bottom: 5,
    right: 10,
    fontSize: 12,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,  // Rounded corners
    backgroundColor: 'red',  // Indicator color
    position: 'absolute',  // Position relative to the iconContainer
    top: 5,
    right: 5,
  },
});

// Export the NotificationItem component
export default NotificationItem;
