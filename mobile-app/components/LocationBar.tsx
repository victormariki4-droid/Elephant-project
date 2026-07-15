import { View, Text } from 'react-native';

export default function LocationBar() {
  return (
    <View
      className="flex-row items-center justify-between px-5 py-3"
      style={{
        backgroundColor: 'rgba(255,255,255,0.92)',
        borderTopWidth: 0.5,
        borderTopColor: 'rgba(0,0,0,0.06)',
      }}
    >
      {/* GPS Status */}
      <View className="flex-row items-center">
        <Text className="text-xs mr-1.5">📍</Text>
        <View>
          <Text className="text-[11px] text-slate-400">GPS Accuracy</Text>
          <Text className="text-xs font-semibold text-primary-600">±4.2m • High</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={{ width: 1, height: 24, backgroundColor: 'rgba(0,0,0,0.06)' }} />

      {/* Sync Status */}
      <View className="flex-row items-center">
        <Text className="text-xs mr-1.5">☁️</Text>
        <View>
          <Text className="text-[11px] text-slate-400">Sync Status</Text>
          <View className="flex-row items-center">
            <View className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-1" />
            <Text className="text-xs font-semibold text-primary-600">Online</Text>
          </View>
        </View>
      </View>

      {/* Network */}
      <View className="flex-row items-center">
        <Text className="text-xs mr-1.5">📶</Text>
        <View>
          <Text className="text-[11px] text-slate-400">Network</Text>
          <Text className="text-xs font-semibold text-slate-700">4G</Text>
        </View>
      </View>
    </View>
  );
}
