import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { themeColor, useTheme } from 'react-native-rapi-ui';

const NotificationItem = ({ icon, title, subtitle }) => {
  const { isDarkmode } = useTheme();

  return (
    <View style={styles.container}>
      <Image source={icon} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: isDarkmode ? themeColor.white100 : themeColor.dark }]}>
          {title}
        </Text>
        <Text style={[styles.subtitle, { color: isDarkmode ? themeColor.grey600 : themeColor.grey900 }]}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
  },
});

export default NotificationItem;
