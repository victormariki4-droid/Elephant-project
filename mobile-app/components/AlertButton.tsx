import { TouchableOpacity, Text, View } from 'react-native';

interface AlertButtonProps {
  type: string;
  emoji: string;
  title: string;
  swahili: string;
  accentColor: string;
  onPress: () => void;
}

export default function AlertButton({
  emoji,
  title,
  swahili,
  accentColor,
  onPress,
}: AlertButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="w-full"
      style={{
        backgroundColor: 'rgba(255,255,255,0.92)',
        borderRadius: 20,
        paddingVertical: 24,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        borderLeftWidth: 4,
        borderLeftColor: accentColor,
        shadowColor: accentColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      <View className="items-center">
        <Text className="text-4xl mb-2">{emoji}</Text>
        <Text className="text-lg font-bold text-slate-900 text-center">
          {title}
        </Text>
        <Text className="text-xs text-slate-400 text-center mt-0.5">
          {swahili}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
