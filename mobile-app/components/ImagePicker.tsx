import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

interface ImagePickerProps {
  image: string | null;
  onImageSelected: (uri: string) => void;
}

export default function ImagePicker({ image, onImageSelected }: ImagePickerProps) {
  const [compressing, setCompressing] = useState(false);

  const compressImage = async (uri: string): Promise<string> => {
    setCompressing(true);
    try {
      // Resize to max 1200px width, compress to ~80% quality → ≤1MB
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1200 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      return result.uri;
    } finally {
      setCompressing(false);
    }
  };

  const pickFromCamera = async () => {
    const { status } = await ExpoImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ExpoImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]) {
      const compressed = await compressImage(result.assets[0].uri);
      onImageSelected(compressed);
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]) {
      const compressed = await compressImage(result.assets[0].uri);
      onImageSelected(compressed);
    }
  };

  return (
    <View>
      {image ? (
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: image }}
            style={{
              width: '100%',
              height: 180,
              borderRadius: 16,
              backgroundColor: '#f1f5f9',
            }}
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={() => onImageSelected('')}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: 'rgba(0,0,0,0.5)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text className="text-white text-xs font-bold">✕</Text>
          </TouchableOpacity>
          <View
            style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              backgroundColor: 'rgba(22,163,74,0.9)',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 8,
            }}
          >
            <Text className="text-white text-[10px] font-semibold">📸 Compressed ≤1MB</Text>
          </View>
        </View>
      ) : (
        <View className="flex-row" style={{ gap: 10 }}>
          <TouchableOpacity
            onPress={pickFromCamera}
            activeOpacity={0.7}
            style={{
              flex: 1,
              backgroundColor: '#f8fafc',
              borderRadius: 14,
              paddingVertical: 20,
              alignItems: 'center',
              borderWidth: 1.5,
              borderColor: 'rgba(0,0,0,0.06)',
              borderStyle: 'dashed',
            }}
          >
            {compressing ? (
              <ActivityIndicator color="#16a34a" />
            ) : (
              <>
                <Text className="text-2xl mb-1">📷</Text>
                <Text className="text-xs text-slate-500 font-medium">Camera</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={pickFromGallery}
            activeOpacity={0.7}
            style={{
              flex: 1,
              backgroundColor: '#f8fafc',
              borderRadius: 14,
              paddingVertical: 20,
              alignItems: 'center',
              borderWidth: 1.5,
              borderColor: 'rgba(0,0,0,0.06)',
              borderStyle: 'dashed',
            }}
          >
            {compressing ? (
              <ActivityIndicator color="#16a34a" />
            ) : (
              <>
                <Text className="text-2xl mb-1">🖼️</Text>
                <Text className="text-xs text-slate-500 font-medium">Gallery</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
