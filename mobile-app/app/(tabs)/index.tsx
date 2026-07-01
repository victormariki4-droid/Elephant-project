import { View, Text, ScrollView } from 'react-native';
import AlertButton from '@/components/AlertButton';
import VoiceRecorder from '@/components/VoiceRecorder';
import LocationBar from '@/components/LocationBar';

export default function AlertCenter() {
  return (
    <View className="flex-1 bg-dark">
      {/* Header */}
      <View className="px-5 pt-14 pb-4">
        <Text className="text-2xl font-bold text-white tracking-tight">
          Alert Center
        </Text>
        <Text className="text-sm text-slate-400 mt-0.5">
          Tap to report an incident / Bonyeza kuripoti tukio
        </Text>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Quick Action Buttons */}
        <View className="flex-row flex-wrap gap-3 mb-6">
          {/* Row 1: Two side-by-side */}
          <View className="flex-row gap-3 w-full">
            <View className="flex-1">
              <AlertButton
                type="sighting"
                emoji="🐘"
                title="Sighting"
                swahili="Tembo Kaonekana"
                bgColor="#f59e0b"
                onPress={() => {/* TODO: navigate to report form */}}
              />
            </View>
            <View className="flex-1">
              <AlertButton
                type="crop_damage"
                emoji="🌾"
                title="Crop Damage"
                swahili="Uharibifu wa Mazao"
                bgColor="#c2410c"
                onPress={() => {}}
              />
            </View>
          </View>

          {/* Row 2: Full-width danger */}
          <AlertButton
            type="immediate_danger"
            emoji="⚠️"
            title="Immediate Danger"
            swahili="Hatari ya Haraka"
            bgColor="#ef4444"
            isEmergency
            onPress={() => {}}
          />
        </View>

        {/* Voice Report */}
        <View className="mb-8">
          <Text className="text-sm font-semibold text-slate-300 mb-3">
            Voice Report / Ripoti kwa Sauti
          </Text>
          <VoiceRecorder />
        </View>
      </ScrollView>

      {/* Footer: Location & Sync */}
      <LocationBar />
    </View>
  );
}
