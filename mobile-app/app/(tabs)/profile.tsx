import { View, Text, TouchableOpacity } from 'react-native';

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-dark pt-14 px-5">
      <Text className="text-2xl font-bold text-white tracking-tight">Profile</Text>
      <Text className="text-sm text-slate-400 mt-1 mb-6">Manage your account / Dhibiti akaunti yako</Text>

      {/* User Card */}
      <View className="bg-dark-card rounded-2xl border border-dark-border p-5 mb-4">
        <View className="flex-row items-center">
          <View className="w-14 h-14 rounded-full bg-primary-600 items-center justify-center mr-4">
            <Text className="text-white text-xl font-bold">U</Text>
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-white">User Name</Text>
            <Text className="text-sm text-slate-400">Villager • Msimba Village</Text>
          </View>
        </View>
      </View>

      {/* Settings Items */}
      {[
        { emoji: '🔔', label: 'Notifications', sub: 'Manage alert preferences' },
        { emoji: '🌐', label: 'Language', sub: 'English / Kiswahili' },
        { emoji: '📱', label: 'Phone Number', sub: '+255 712 345 678' },
        { emoji: '🔒', label: 'Privacy', sub: 'Data and permissions' },
      ].map((item, i) => (
        <TouchableOpacity
          key={i}
          className="flex-row items-center bg-dark-card rounded-xl border border-dark-border p-4 mb-2 active:opacity-80"
        >
          <Text className="text-xl mr-3">{item.emoji}</Text>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-white">{item.label}</Text>
            <Text className="text-xs text-slate-500">{item.sub}</Text>
          </View>
          <Text className="text-slate-600">›</Text>
        </TouchableOpacity>
      ))}

      {/* Logout */}
      <TouchableOpacity className="mt-6 bg-danger-600/20 rounded-xl py-4 items-center border border-danger-600/30 active:opacity-80">
        <Text className="text-danger-500 font-bold">Log Out / Ondoka</Text>
      </TouchableOpacity>
    </View>
  );
}
