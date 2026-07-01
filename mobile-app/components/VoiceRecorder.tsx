import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <View className="items-center">
      <TouchableOpacity
        onPressIn={() => setIsRecording(true)}
        onPressOut={() => setIsRecording(false)}
        activeOpacity={0.8}
        className="items-center"
      >
        {/* Outer ring */}
        <View
          className={`w-20 h-20 rounded-full items-center justify-center ${
            isRecording
              ? 'bg-danger-600'
              : 'bg-dark-card border-2 border-dark-border'
          }`}
          style={
            isRecording
              ? {
                  shadowColor: '#ef4444',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.6,
                  shadowRadius: 20,
                  elevation: 10,
                }
              : {}
          }
        >
          <Text className="text-3xl">{isRecording ? '🔴' : '🎙️'}</Text>
        </View>
      </TouchableOpacity>

      <Text className="text-xs text-slate-500 mt-3 text-center">
        {isRecording
          ? 'Recording... Release to stop / Inarekodiwa...'
          : 'Hold to record / Shikilia kurekodi'}
      </Text>
    </View>
  );
}
