import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import LocationBar from '@/components/LocationBar';
import { alertTypes } from '@/constants/theme';

const alertCards = [
  { type: 'sighting', ...alertTypes.sighting },
  { type: 'property_damage', ...alertTypes.property_damage },
  { type: 'crop_damage', ...alertTypes.crop_damage },
  { type: 'livestock_killing', ...alertTypes.livestock_killing },
  { type: 'human_injury', ...alertTypes.human_injury },
  { type: 'human_death', ...alertTypes.human_death },
] as const;

export default function AlertCenter() {
  const handleCardPress = (type: string) => {
    router.push(`/report/${type}`);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#f0f4f8' }}>
      {/* Header */}
      <View className="px-5 pt-14 pb-3">
        <View className="flex-row items-center mb-1">
          <Image
            source={require('../../assets/tef-logo.png')}
            style={{ width: 44, height: 44, borderRadius: 22, marginRight: 10 }}
            resizeMode="contain"
          />
          <View>
            <Text className="text-2xl font-bold text-slate-900 tracking-tight">
              HEC Alert Center
            </Text>
            <Text className="text-[11px] text-slate-400 font-medium -mt-0.5">
              Powered by TEF
            </Text>
          </View>
        </View>
        <Text className="text-sm text-slate-500 mt-1">
          Tap to report an incident / Bonyeza kuripoti tukio
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* 2×2 Card Grid */}
        <View className="flex-row flex-wrap" style={{ marginHorizontal: -6 }}>
          {alertCards.map((card) => (
            <View key={card.type} style={{ width: '50%', padding: 6 }}>
              <TouchableOpacity
                onPress={() => handleCardPress(card.type)}
                activeOpacity={0.7}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.92)',
                  borderRadius: 20,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,0.05)',
                  borderLeftWidth: 4,
                  borderLeftColor: card.color,
                  shadowColor: card.color,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.12,
                  shadowRadius: 12,
                  elevation: 4,
                  minHeight: 150,
                  justifyContent: 'space-between',
                }}
              >
                {/* Emoji Badge */}
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    backgroundColor: `${card.color}15`,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}
                >
                  <Text className="text-2xl">{card.emoji}</Text>
                </View>

                {/* Labels */}
                <View>
                  <Text
                    className="text-base font-bold"
                    style={{ color: '#1e293b' }}
                  >
                    {card.label}
                  </Text>
                  <Text
                    className="text-xs mt-0.5"
                    style={{ color: '#94a3b8' }}
                  >
                    {card.swahili}
                  </Text>
                </View>

                {/* Arrow */}
                <View
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: `${card.color}12`,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: card.color, fontSize: 14, fontWeight: '700' }}>›</Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Quick Tip Card */}
        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderRadius: 16,
            padding: 16,
            marginTop: 12,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.05)',
          }}
        >
          <View className="flex-row items-center mb-2">
            <Text className="text-sm mr-2">💡</Text>
            <Text className="text-sm font-semibold text-slate-700">Quick Tip / Kidokezo</Text>
          </View>
          <Text className="text-xs text-slate-500 leading-5">
            Each report includes GPS location, photo upload, voice notes, and detailed checklists. 
            Your report helps rangers respond faster!
          </Text>
        </View>

        {/* TEF Footer */}
        <View className="items-center mt-6 mb-4">
          <Text className="text-[10px] text-slate-400 text-center">
            Powered by Tanzanian Elephant Foundation (TEF)
          </Text>
        </View>
      </ScrollView>

      {/* Footer: Location & Sync */}
      <LocationBar />
    </View>
  );
}
