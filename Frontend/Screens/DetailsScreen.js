// DetailsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DetailsScreen = () => {
  // Dummy Data
  const vehicleDetails = {
    licensePlate: 'ABC-123',
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    color: 'Silver',
    owner: 'John Doe',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vehicle Details</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>License Plate:</Text>
        <Text style={styles.value}>{vehicleDetails.licensePlate}</Text>

        <Text style={styles.label}>Make:</Text>
        <Text style={styles.value}>{vehicleDetails.make}</Text>

        <Text style={styles.label}>Model:</Text>
        <Text style={styles.value}>{vehicleDetails.model}</Text>

        <Text style={styles.label}>Year:</Text>
        <Text style={styles.value}>{vehicleDetails.year}</Text>

        <Text style={styles.label}>Color:</Text>
        <Text style={styles.value}>{vehicleDetails.color}</Text>

        <Text style={styles.label}>Owner:</Text>
        <Text style={styles.value}>{vehicleDetails.owner}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default DetailsScreen;
