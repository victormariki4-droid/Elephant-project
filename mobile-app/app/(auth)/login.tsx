import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(TextInput | null)[]>([]);

  const handleSendOtp = () => {
    if (phone.length >= 9) {
      setShowOtp(true);
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    // Auto-advance to next input
    if (text && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-dark"
    >
      <View className="flex-1 justify-center px-6">
        {/* Brand */}
        <View className="items-center mb-10">
          <Text className="text-5xl mb-3">🐘</Text>
          <Text className="text-3xl font-bold text-white tracking-tight">
            HEC Tracker
          </Text>
          <Text className="text-sm text-slate-400 mt-1">
            Human-Elephant Conflict Monitor
          </Text>
        </View>

        {!showOtp ? (
          /* Phone Number Input */
          <View>
            <Text className="text-sm font-semibold text-slate-300 mb-2">
              Phone Number / Namba ya Simu
            </Text>
            <View className="flex-row items-center bg-dark-card rounded-2xl border border-dark-border px-4">
              <Text className="text-white text-base font-semibold mr-2">
                +255
              </Text>
              <View className="w-px h-6 bg-dark-border mr-3" />
              <TextInput
                className="flex-1 text-white text-lg py-4"
                placeholder="712 345 678"
                placeholderTextColor="#64748b"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                maxLength={10}
              />
            </View>

            <TouchableOpacity
              className="mt-6 bg-primary-600 rounded-2xl py-4 items-center active:opacity-80"
              onPress={handleSendOtp}
            >
              <Text className="text-white text-base font-bold">
                Send Verification Code
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* OTP Input */
          <View>
            <Text className="text-sm font-semibold text-slate-300 mb-2 text-center">
              Enter the 6-digit code sent to +255{phone}
            </Text>
            <View className="flex-row justify-between mt-4 px-4">
              {otp.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={(ref) => { otpRefs.current[i] = ref; }}
                  className="w-12 h-14 bg-dark-card border-2 border-dark-border rounded-xl text-white text-2xl text-center font-bold"
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, i)}
                  style={digit ? { borderColor: '#16a34a' } : {}}
                />
              ))}
            </View>

            <TouchableOpacity
              className="mt-8 bg-primary-600 rounded-2xl py-4 items-center active:opacity-80"
              onPress={() => {/* TODO: Verify OTP via Firebase */}}
            >
              <Text className="text-white text-base font-bold">
                Verify & Continue
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-4 items-center"
              onPress={() => setShowOtp(false)}
            >
              <Text className="text-slate-400 text-sm">
                ← Change phone number
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Footer */}
        <Text className="text-slate-600 text-xs text-center mt-12">
          Protected by Tanzania Wildlife Authority
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
