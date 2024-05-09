import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { themeColor, Text } from 'react-native-rapi-ui';

const NotificationItem = ({ icon, title, read, subtitle, onPress }) => {

  return (
    <TouchableOpacity style={{...styles.container, backgroundColor: read ? themeColor.white200 : themeColor.white}} onPress={onPress}>
      <View style={{...styles.iconContainer, backgroundColor: themeColor.primary400}}>
        {icon}
      </View>
      <View style={styles.textContainer}>
        <Text>
          {title}
        </Text>
        <Text>
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
  },
});

export default NotificationItem;
