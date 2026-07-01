import { View, Text, ScrollView } from 'react-native';
import MissionCard from '@/components/MissionCard';
import MitigationForm from '@/components/MitigationForm';

const mockMissions = [
  {
    id: '1',
    type: 'immediate_danger' as const,
    description: 'Herd of 6 elephants approaching Msimba village croplands.',
    village: 'Msimba',
    timestamp: '5 min ago',
    distance: '2.3 km',
  },
  {
    id: '2',
    type: 'crop_damage' as const,
    description: 'Maize field heavily damaged overnight near Uru East.',
    village: 'Uru East',
    timestamp: '18 min ago',
    distance: '5.1 km',
  },
];

export default function MissionsScreen() {
  return (
    <View className="flex-1 bg-dark">
      {/* Header */}
      <View className="px-5 pt-14 pb-4 border-b border-dark-border">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-white tracking-tight">
              🛡️ Ranger Mode
            </Text>
            <Text className="text-sm text-slate-400 mt-0.5">
              Active missions / Misheni hai
            </Text>
          </View>
          <View className="bg-primary-600/20 px-3 py-1.5 rounded-full border border-primary-600/30">
            <Text className="text-primary-500 text-xs font-bold">
              {mockMissions.length} Active
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Active Missions */}
        {mockMissions.map((mission) => (
          <MissionCard key={mission.id} mission={mission} />
        ))}

        {/* Post-Resolution Form */}
        <View className="mt-6 mb-10">
          <Text className="text-sm font-semibold text-slate-300 mb-3">
            Post-Resolution Report / Ripoti ya Baada ya Utatuzi
          </Text>
          <MitigationForm />
        </View>
      </ScrollView>
    </View>
  );
}
