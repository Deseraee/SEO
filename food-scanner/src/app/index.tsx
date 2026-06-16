// Home / Scan screen (Track A).
// Lets the user take a photo or pick one from their library, sends it to
// analyzeFood() (OpenAI), and navigates to the result screen with the data.

import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppColors } from '@/constants/colors';
import { analyzeFood } from '@/services/openai';

export default function HomeScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Shared handler: given a picked photo, analyze it and go to the result screen.
  async function handlePhoto(asset: ImagePicker.ImagePickerAsset) {
    if (!asset.base64) {
      setError('Could not read that photo. Try another one.');
      return;
    }

    setImageUri(asset.uri);
    setError(null);
    setLoading(true);

    try {
      const result = await analyzeFood(asset.base64);
      // Pass the result to the result screen as a JSON string.
      router.push({
        pathname: '/result',
        params: { data: JSON.stringify(result) },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  // Open the camera to take a new photo.
  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setError('Camera permission is needed to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      base64: true,
      quality: 0.4, // keep the base64 payload small
    });

    if (!result.canceled) {
      handlePhoto(result.assets[0]);
    }
  }

  // Pick an existing photo from the library.
  async function pickFromLibrary() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      base64: true,
      quality: 0.4,
    });

    if (!result.canceled) {
      handlePhoto(result.assets[0]);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Food Scanner</Text>
          <Text style={styles.subtitle}>Snap a photo to see the calories</Text>
        </View>

        {/* Photo preview / placeholder */}
        <View style={styles.previewBox}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <Text style={styles.previewText}>Your photo will appear here</Text>
          )}

          {/* Loading overlay while the AI analyzes the photo */}
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={AppColors.green} />
              <Text style={styles.loadingText}>Analyzing…</Text>
            </View>
          )}
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={[styles.button, styles.buttonPrimary, loading && styles.buttonDisabled]}
          onPress={takePhoto}
          disabled={loading}>
          <Text style={styles.buttonPrimaryText}>Take Photo</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.buttonSecondary, loading && styles.buttonDisabled]}
          onPress={pickFromLibrary}
          disabled={loading}>
          <Text style={styles.buttonSecondaryText}>Choose from Library</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: AppColors.page,
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  titleBlock: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: AppColors.text,
  },
  subtitle: {
    fontSize: 15,
    color: AppColors.muted,
    marginTop: 4,
  },
  previewBox: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#f3f0ec',
    borderWidth: 2,
    borderColor: '#cfd3d8',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewText: {
    color: AppColors.muted,
    fontSize: 15,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: AppColors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  error: {
    color: AppColors.red,
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: AppColors.green,
  },
  buttonPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: AppColors.green,
  },
  buttonSecondaryText: {
    color: AppColors.green,
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
