// AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CameraComponent from '../Screens/CameraScreen'; // Changed to CameraComponent
import DetailsScreen from '../Screens/DetailsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Camera"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2563eb',
        },
        headerTitleStyle: {
          color: '#ffffff',
        },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen 
        name="Camera" 
        component={CameraComponent} // Changed to CameraComponent
        options={{ 
          title: 'Capture License Plate',
        }}
      />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen}
        options={{ 
          title: 'Vehicle Details',
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
