import { View, Text } from 'react-native';

export default function LocationBar() {
  return (
    <View className="flex-row items-center justify-between px-5 py-3 bg-dark-card border-t border-dark-border">
      {/* GPS Status */}
      <View className="flex-row items-center">
        <Text className="text-xs mr-1.5">📍</Text>
        <View>
          <Text className="text-[11px] text-slate-400">GPS Accuracy</Text>
          <Text className="text-xs font-semibold text-primary-500">±4.2m • High</Text>
        </View>
      </View>

      {/* Divider */}
      <View className="w-px h-6 bg-dark-border" />

      {/* Sync Status */}
      <View className="flex-row items-center">
        <Text className="text-xs mr-1.5">☁️</Text>
        <View>
          <Text className="text-[11px] text-slate-400">Sync Status</Text>
          <View className="flex-row items-center">
            <View className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-1" />
            <Text className="text-xs font-semibold text-primary-500">Online</Text>
          </View>
        </View>
      </View>

      {/* Battery / Signal indicator */}
      <View className="flex-row items-center">
        <Text className="text-xs mr-1.5">📶</Text>
        <View>
          <Text className="text-[11px] text-slate-400">Network</Text>
          <Text className="text-xs font-semibold text-slate-300">4G</Text>
        </View>
      </View>
    </View>
  );
}
