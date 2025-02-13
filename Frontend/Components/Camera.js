import React, { useState, useEffect, useRef } from 'react';
import { 
  SafeAreaView, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Platform,
  ActivityIndicator,
  View 
} from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';

const CameraComponent = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    requestCameraPermission();
    return () => {
      // Cleanup
      if (cameraRef.current) {
        cameraRef.current = null;
      }
    };
  }, []);

  const requestCameraPermission = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera permission is required to use this feature'
        );
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      setHasPermission(false);
      Alert.alert('Error', 'Failed to request camera permission');
    }
  };

  const processImage = async (uri) => {
    try {
      // Optimize image before sending
      const optimizedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      return optimizedImage.uri;
    } catch (error) {
      console.error('Image processing error:', error);
      throw new Error('Failed to process image');
    }
  };

  const onPhotoTaken = async (photoUri) => {
    if (!photoUri) {
      console.error('No photo URI provided');
      Alert.alert('Error', 'Failed to process photo');
      return;
    }

    try {
      // Show loading state
      setIsLoading(true);

      // Create form data for image upload
      const formData = new FormData();
      formData.append('photo', {
        uri: photoUri,
        type: 'image/jpeg',
        name: 'license_plate.jpg'
      });

      // Make API call to your backend
      const response = await fetch('YOUR_API_ENDPOINT/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const result = await response.json();

      // Handle successful upload
      Alert.alert(
        'Success',
        'Photo uploaded successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to results screen with the data
              navigation.navigate('Results', { data: result });
            }
          }
        ]
      );

    } catch (error) {
      console.error('Error handling photo:', error);
      Alert.alert(
        'Error',
        'Failed to process photo. Please try again.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Optional: Add error recovery logic here
            }
          }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current || isProcessing) {
      return;
    }

    setIsProcessing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: Platform.OS === 'android',
        exif: false
      });

      const processedUri = await processImage(photo.uri);
      
      Alert.alert(
        'Photo Taken!',
        'Would you like to use this photo?',
        [
          { 
            text: 'Retake', 
            style: 'cancel',
            onPress: () => setIsProcessing(false)
          },
          {
            text: 'Use Photo',
            onPress: () => {
              onPhotoTaken(processedUri);
              setIsProcessing(false);
            }
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Camera capture error:', error);
      Alert.alert('Error', 'Failed to take picture');
      setIsProcessing(false);
    }
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.permissionView}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.permissionView}>
        <Text style={styles.permissionText}>No access to camera</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
      >
        {/* Scanning Frame */}
        <SafeAreaView style={styles.overlay}>
          <SafeAreaView style={styles.scanFrame}>
            <SafeAreaView style={styles.cornerTL} />
            <SafeAreaView style={styles.cornerTR} />
            <SafeAreaView style={styles.cornerBL} />
            <SafeAreaView style={styles.cornerBR} />
          </SafeAreaView>
        </SafeAreaView>

        {/* Camera Controls */}
        <SafeAreaView style={styles.controls}>
          <Text style={styles.guideText}>
            Position license plate within frame
          </Text>
          <TouchableOpacity 
            style={styles.captureButton}
            onPress={takePicture}
            disabled={isProcessing || isLoading}
          >
            <SafeAreaView style={styles.captureButtonInner} />
          </TouchableOpacity>
        </SafeAreaView>

        {/* Loading Overlay */}
        {(isLoading || isProcessing) && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}
      </CameraView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  permissionView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    fontSize: 18,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 300,
    height: 100,
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderLeftWidth: 3,
    borderTopWidth: 3,
    borderColor: 'white',
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRightWidth: 3,
    borderTopWidth: 3,
    borderColor: 'white',
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: 'white',
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: 'white',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    alignItems: 'center',
  },
  guideText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
    paddingBottom:80
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'white',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CameraComponent;