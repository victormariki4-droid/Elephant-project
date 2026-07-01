import { TouchableOpacity, Text, View } from 'react-native';

interface AlertButtonProps {
  type: string;
  emoji: string;
  title: string;
  swahili: string;
  bgColor: string;
  isEmergency?: boolean;
  onPress: () => void;
}

export default function AlertButton({
  emoji,
  title,
  swahili,
  bgColor,
  isEmergency = false,
  onPress,
}: AlertButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className="w-full"
      style={{
        backgroundColor: bgColor,
        borderRadius: 20,
        paddingVertical: isEmergency ? 28 : 24,
        paddingHorizontal: 20,
        // Subtle shadow
        shadowColor: bgColor,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      <View className="items-center">
        <Text className="text-4xl mb-2">{emoji}</Text>
        <Text className="text-lg font-bold text-white text-center">
          {title}
        </Text>
        <Text className="text-xs text-white/70 text-center mt-0.5">
          {swahili}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
