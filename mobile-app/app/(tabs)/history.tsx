import { View, Text } from 'react-native';

export default function HistoryScreen() {
  return (
    <View className="flex-1 bg-dark pt-14 px-5">
      <Text className="text-2xl font-bold text-white tracking-tight">History</Text>
      <Text className="text-sm text-slate-400 mt-1 mb-6">Your past reports / Ripoti zako za awali</Text>

      <View className="flex-1 items-center justify-center">
        <Text className="text-5xl mb-4">📋</Text>
        <Text className="text-lg font-semibold text-slate-300">No Reports Yet</Text>
        <Text className="text-sm text-slate-500 text-center mt-2 px-8">
          Your submitted reports will appear here. Start by reporting an incident from the Alert Center.
        </Text>
      </View>
    </View>
  );
}
