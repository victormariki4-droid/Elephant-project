import { View, Text, TouchableOpacity } from 'react-native';

interface Mission {
  id: string;
  type: 'sighting' | 'crop_damage' | 'immediate_danger';
  description: string;
  village: string;
  timestamp: string;
  distance: string;
}

const typeConfig = {
  sighting: { color: '#f59e0b', label: 'Sighting', borderColor: '#f59e0b' },
  crop_damage: { color: '#c2410c', label: 'Crop Damage', borderColor: '#c2410c' },
  immediate_danger: { color: '#ef4444', label: 'Emergency', borderColor: '#ef4444' },
};

export default function MissionCard({ mission }: { mission: Mission }) {
  const config = typeConfig[mission.type];

  return (
    <View
      className="bg-dark-card rounded-2xl p-4 mb-3"
      style={{ borderLeftWidth: 4, borderLeftColor: config.borderColor }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-2">
        <View
          className="px-2.5 py-1 rounded-full"
          style={{ backgroundColor: config.color + '20' }}
        >
          <Text style={{ color: config.color }} className="text-[10px] font-bold">
            {config.label.toUpperCase()}
          </Text>
        </View>
        <Text className="text-[11px] text-slate-500">{mission.timestamp}</Text>
      </View>

      {/* Description */}
      <Text className="text-sm text-slate-200 leading-5 mb-3">
        {mission.description}
      </Text>

      {/* Footer */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Text className="text-[11px] text-slate-500">
            📍 {mission.village}
          </Text>
          <Text className="text-[11px] text-slate-500">
            📏 {mission.distance}
          </Text>
        </View>
      </View>

      {/* Accept Button */}
      <TouchableOpacity
        className="mt-4 rounded-xl py-3.5 items-center active:opacity-80"
        style={{ backgroundColor: config.color }}
      >
        <Text className="text-white text-sm font-bold">
          Accept Mission / Kubali Misheni →
        </Text>
      </TouchableOpacity>
    </View>
  );
}
