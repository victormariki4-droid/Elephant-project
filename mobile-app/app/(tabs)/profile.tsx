import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

export default function ProfileScreen() {
  const [userName, setUserName] = useState('User');
  const [userRole, setUserRole] = useState('villager');

  useEffect(() => {
    const loadUser = async () => {
      const name = await AsyncStorage.getItem('userName');
      const role = await AsyncStorage.getItem('userRole');
      if (name) setUserName(name);
      if (role) setUserRole(role);
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.clear();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View className="flex-1 pt-14 px-5" style={{ backgroundColor: '#f0f4f8' }}>
      <Text className="text-2xl font-bold text-slate-900 tracking-tight">Profile</Text>
      <Text className="text-sm text-slate-500 mt-1 mb-6">Manage your account / Dhibiti akaunti yako</Text>

      {/* User Card */}
      <View
        style={{
          backgroundColor: 'rgba(255,255,255,0.92)',
          borderRadius: 20,
          padding: 20,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.05)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <View className="flex-row items-center">
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              backgroundColor: '#16a34a',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16,
            }}
          >
            <Text className="text-white text-xl font-bold">
              {userName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-slate-900">{userName}</Text>
            <Text className="text-sm text-slate-400 capitalize">{userRole}</Text>
          </View>
        </View>
      </View>

      {/* Settings Items */}
      {[
        { emoji: '🔔', label: 'Notifications', sub: 'Manage alert preferences' },
        { emoji: '🌐', label: 'Language', sub: 'English / Kiswahili' },
        { emoji: '📱', label: 'Phone Number', sub: '+255 XXX XXX XXX' },
        { emoji: '🔒', label: 'Privacy', sub: 'Data and permissions' },
      ].map((item, i) => (
        <TouchableOpacity
          key={i}
          style={{
            backgroundColor: 'rgba(255,255,255,0.92)',
            borderRadius: 16,
            padding: 16,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.05)',
            flexDirection: 'row',
            alignItems: 'center',
          }}
          activeOpacity={0.7}
        >
          <Text className="text-xl mr-3">{item.emoji}</Text>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-slate-800">{item.label}</Text>
            <Text className="text-xs text-slate-400">{item.sub}</Text>
          </View>
          <Text className="text-slate-300 text-lg">›</Text>
        </TouchableOpacity>
      ))}

      {/* Logout */}
      <TouchableOpacity
        onPress={handleLogout}
        activeOpacity={0.7}
        style={{
          marginTop: 24,
          backgroundColor: '#fef2f2',
          borderRadius: 16,
          paddingVertical: 16,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#fecaca',
        }}
      >
        <Text style={{ color: '#dc2626', fontWeight: '700' }}>Log Out / Ondoka</Text>
      </TouchableOpacity>

      {/* TEF Footer */}
      <View className="items-center mt-6">
        <Text className="text-[10px] text-slate-400 text-center">
          Powered by Tanzanian Elephant Foundation (TEF)
        </Text>
      </View>
    </View>
  );
}
