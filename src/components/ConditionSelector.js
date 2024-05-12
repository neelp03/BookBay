// Import necessary React and React Native components, hooks, and other utilities
import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native';
import { useTheme, themeColor, Text } from 'react-native-rapi-ui';

// Calculate the width of the screen minus margins
const screenWidth = Dimensions.get('window').width - 40; 
// Define the condition options available
const options = ['New', 'Good', 'Acceptable'];
// Calculate the width each option should have based on the number of options
const optionWidth = screenWidth / options.length;

/**
 * ConditionSelector component allows users to select a condition for an item.
 * It visually highlights the currently selected condition using an animation.
 * 
 * @param {string} selectedCondition - The current condition selected.
 * @param {function} onSelect - Function to set the selected condition.
 */
const ConditionSelector = ({ selectedCondition, onSelect }) => {
  // Use theme from context to handle dark/light mode styles
  const { isDarkmode } = useTheme();
  
  // Calculate initial positions for the animated highlight based on the selected condition
  const positions = options.reduce((acc, option, index) => ({
    ...acc,
    [option]: index * optionWidth  // Compute and assign positions based on index
  }), {});
  
  // Reference for the animation value initialized to the starting position of the selected condition
  const animValue = useRef(new Animated.Value(positions[selectedCondition])).current;

  // Effect hook to animate the highlight when the selected condition changes
  useEffect(() => {
    Animated.spring(animValue, {
      toValue: positions[selectedCondition], // Target position based on the selected condition
      useNativeDriver: true,               // Use native driver for better performance
      speed: 14,                           // Control the speed of the animation
      bounciness: 8                        // Control the bounciness of the animation
    }).start();
  }, [selectedCondition]);  // Dependency array to trigger animation on change

  // Render the component
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.highlight, { width: optionWidth, transform: [{ translateX: animValue }] }]} />
      {options.map((condition) => (
        <TouchableOpacity
          key={condition}
          style={[styles.option, { width: optionWidth }]}
          onPress={() => onSelect(condition)}  // Handle condition selection
        >
          <Text
            style={{
              color: condition === selectedCondition ? themeColor.white : isDarkmode ? themeColor.white : themeColor.dark,
              fontWeight: condition === selectedCondition ? 'bold' : 'normal'  // Bold for selected condition
            }}
          >
            {condition}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// StyleSheet for the component's styling
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 15,
    backgroundColor: themeColor.grey100,  // Set background color
  },
  highlight: {
    position: 'absolute',
    height: '100%',
    backgroundColor: themeColor.primary,  // Highlight color
    borderRadius: 20,
  },
  option: {
    justifyContent: 'center',
    alignItems: 'center',  // Center content within each option
  }
});

// Export the ConditionSelector component for use in other parts of the application
export default ConditionSelector;
