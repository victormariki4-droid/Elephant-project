import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../../lib/firebase';

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (identifier.length < 3 || password.length < 6) {
      Alert.alert('Error', 'Please enter valid credentials. Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      let formattedId = identifier.replace(/\s+/g, '');
      if (/^\d{9}$/.test(formattedId)) {
        formattedId = `+255${formattedId}`;
      } else if (/^0\d{9}$/.test(formattedId)) {
        formattedId = `+255${formattedId.substring(1)}`;
      }

      const emailMapping = `${formattedId}@hec.local`;
      const userCredential = await signInWithEmailAndPassword(auth, emailMapping, password);
      const uid = userCredential.user.uid;

      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        Alert.alert('Profile Not Found', 'Your account exists but profile data is missing. Contact admin.');
        setLoading(false);
        return;
      }

      const userData = userDocSnap.data();
      const userRole = userData.role || 'villager';

      await AsyncStorage.setItem('userPhone', userData.phone || formattedId);
      await AsyncStorage.setItem('userRole', userRole);
      await AsyncStorage.setItem('userId', uid);
      await AsyncStorage.setItem('userName', userData.name || 'User');

      if (userRole === 'ranger') {
        router.replace('/(ranger)/missions');
      } else {
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1"
      style={{ backgroundColor: '#f0f4f8' }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand */}
        <View className="items-center mb-10">
          <Image
            source={require('../../assets/tef-logo.png')}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              marginBottom: 16,
            }}
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-slate-900 tracking-tight">
            HEC Alert Center
          </Text>
          <Text className="text-sm text-slate-500 mt-1">
            Human-Elephant Conflict Monitor
          </Text>
        </View>

        {/* Inputs */}
        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderRadius: 24,
            padding: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 16,
            elevation: 6,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.05)',
          }}
        >
          <View>
            <Text className="text-sm font-semibold text-slate-700 mb-2">
              Phone Number or Username
            </Text>
            <View
              className="flex-row items-center rounded-2xl px-4 py-1"
              style={{
                backgroundColor: '#f8fafc',
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.08)',
              }}
            >
              <TextInput
                className="flex-1 text-slate-900 text-lg py-3"
                placeholder="e.g. 712 345 678"
                placeholderTextColor="#94a3b8"
                keyboardType="default"
                autoCapitalize="none"
                value={identifier}
                onChangeText={setIdentifier}
                editable={!loading}
              />
            </View>
          </View>

          <View className="mt-4">
            <Text className="text-sm font-semibold text-slate-700 mb-2">
              Password
            </Text>
            <View
              className="flex-row items-center rounded-2xl px-4 py-1"
              style={{
                backgroundColor: '#f8fafc',
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.08)',
              }}
            >
              <TextInput
                className="flex-1 text-slate-900 text-lg py-3"
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                className="ml-2 p-1"
              >
                <Text className="text-slate-400 text-lg">
                  {showPassword ? '🙈' : '👁️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            className={`mt-6 rounded-2xl py-4 items-center flex-row justify-center ${loading ? 'opacity-70' : ''}`}
            style={{
              backgroundColor: '#16a34a',
              shadowColor: '#16a34a',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <>
                <ActivityIndicator color="#ffffff" style={{ marginRight: 8 }} />
                <Text className="text-white text-base font-bold">Authenticating...</Text>
              </>
            ) : (
              <Text className="text-white text-base font-bold">
                Login / Ingia
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="items-center mt-10">
          <Text className="text-slate-400 text-xs text-center">
            Powered by
          </Text>
          <Text className="text-slate-600 text-xs text-center font-semibold mt-0.5">
            Tanzanian Elephant Foundation (TEF)
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
