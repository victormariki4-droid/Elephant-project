import { View, Text } from 'react-native';

export default function HistoryScreen() {
  return (
    <View className="flex-1 pt-14 px-5" style={{ backgroundColor: '#f0f4f8' }}>
      <Text className="text-2xl font-bold text-slate-900 tracking-tight">History</Text>
      <Text className="text-sm text-slate-500 mt-1 mb-6">Your past reports / Ripoti zako za awali</Text>

      <View className="flex-1 items-center justify-center">
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'rgba(255,255,255,0.9)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Text className="text-4xl">📋</Text>
        </View>
        <Text className="text-lg font-semibold text-slate-700">No Reports Yet</Text>
        <Text className="text-sm text-slate-400 text-center mt-2 px-8">
          Your submitted reports will appear here. Start by reporting an incident from the Alert Center.
        </Text>
      </View>
    </View>
  );
}
