import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { mitigationMethods } from '@/constants/theme';

export default function MitigationForm() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <View className="bg-dark-card rounded-2xl border border-dark-border p-4">
      <Text className="text-sm font-semibold text-white mb-3">
        Mitigation Methods Used / Njia Zilizotumika
      </Text>

      <View className="flex-row flex-wrap gap-2">
        {mitigationMethods.map((method) => {
          const isActive = selected.includes(method.id);
          return (
            <TouchableOpacity
              key={method.id}
              onPress={() => toggle(method.id)}
              className={`flex-row items-center px-3 py-2.5 rounded-xl border ${
                isActive
                  ? 'bg-primary-600/20 border-primary-600'
                  : 'bg-dark border-dark-border'
              }`}
              activeOpacity={0.7}
            >
              <Text className="text-sm mr-1.5">{method.emoji}</Text>
              <Text
                className={`text-xs font-medium ${
                  isActive ? 'text-primary-500' : 'text-slate-400'
                }`}
              >
                {method.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Submit */}
      <TouchableOpacity
        className="mt-4 bg-primary-600 rounded-xl py-3.5 items-center active:opacity-80"
        disabled={selected.length === 0}
        style={{ opacity: selected.length === 0 ? 0.5 : 1 }}
      >
        <Text className="text-white text-sm font-bold">
          Submit Report / Tuma Ripoti
        </Text>
      </TouchableOpacity>
    </View>
  );
}
