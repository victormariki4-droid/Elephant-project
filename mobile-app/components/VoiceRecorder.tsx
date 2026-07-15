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
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isRecording ? '#dc2626' : 'rgba(255,255,255,0.9)',
            borderWidth: isRecording ? 0 : 1.5,
            borderColor: 'rgba(0,0,0,0.08)',
            shadowColor: isRecording ? '#ef4444' : '#000',
            shadowOffset: { width: 0, height: isRecording ? 0 : 2 },
            shadowOpacity: isRecording ? 0.5 : 0.06,
            shadowRadius: isRecording ? 16 : 8,
            elevation: isRecording ? 8 : 3,
          }}
        >
          <Text className="text-2xl">{isRecording ? '🔴' : '🎙️'}</Text>
        </View>
      </TouchableOpacity>

      <Text className="text-xs text-slate-400 mt-2 text-center">
        {isRecording
          ? 'Recording... Release to stop / Inarekodiwa...'
          : 'Hold to record / Shikilia kurekodi'}
      </Text>
    </View>
  );
}
