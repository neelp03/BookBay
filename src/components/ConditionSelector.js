import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native';
import { useTheme, themeColor, Text } from 'react-native-rapi-ui';

const screenWidth = Dimensions.get('window').width - 40; // Get screen width
const options = ['New', 'Good', 'Acceptable'];
const optionWidth = screenWidth / options.length;

const ConditionSelector = ({ selectedCondition, onSelect }) => {
  const { isDarkmode } = useTheme();
  const positions = options.reduce((acc, option, index) => ({
    ...acc,
    [option]: index * optionWidth
  }), {});
  const animValue = useRef(new Animated.Value(positions[selectedCondition])).current;

  useEffect(() => {
    Animated.spring(animValue, {
      toValue: positions[selectedCondition],
      useNativeDriver: true,
      speed: 14,
      bounciness: 8
    }).start();
  }, [selectedCondition]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.highlight, { width: optionWidth, transform: [{ translateX: animValue }] }]} />
      {options.map((condition) => (
        <TouchableOpacity
          key={condition}
          style={[styles.option, { width: optionWidth }]}
          onPress={() => onSelect(condition)}
        >
          <Text
            style={{
              color: condition === selectedCondition ? themeColor.white : isDarkmode ? themeColor.white : themeColor.dark,
              fontWeight: condition === selectedCondition ? 'bold' : 'normal'
            }}
          >
            {condition}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 15,
    backgroundColor: themeColor.grey100, // Adjust to match your theme
  },
  highlight: {
    position: 'absolute',
    height: '100%',
    backgroundColor: themeColor.primary,
    borderRadius: 20,
  },
  option: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default ConditionSelector;
