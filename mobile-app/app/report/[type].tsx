import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert as RNAlert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as Location from 'expo-location';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../../lib/firebase';
import { alertTypes } from '../../constants/theme';
import VoiceRecorder from '../../components/VoiceRecorder';
import ImagePicker from '../../components/ImagePicker';

// ── Type-specific form configs ──────────────────────────────
const SIGHTING_COUNTS = [
  { id: '1-5', label: '1 – 5', emoji: '🐘' },
  { id: '5-10', label: '5 – 10', emoji: '🐘🐘' },
  { id: '10+', label: '10+', emoji: '🐘🐘🐘' },
];

const DAMAGE_TYPES = [
  { id: 'houses', label: 'Houses / Nyumba', emoji: '🏠' },
  { id: 'crops', label: 'Crops / Mazao', emoji: '🌾' },
  { id: 'livestock', label: 'Livestock / Mifugo', emoji: '🐄' },
];

const SEVERITY_LEVELS = [
  { id: 'severe', label: 'Mkubwa Sana', sublabel: 'Severe', color: '#dc2626' },
  { id: 'moderate', label: 'Kiasi', sublabel: 'Moderate', color: '#f59e0b' },
  { id: 'minor', label: 'Kawaida', sublabel: 'Minor', color: '#22c55e' },
];

const INJURY_SEVERITY = [
  { id: 'minor', label: 'Ndogo', sublabel: 'Minor', emoji: '🩹' },
  { id: 'moderate', label: 'Wastani', sublabel: 'Moderate', emoji: '🏥' },
  { id: 'severe', label: 'Kubwa / Hatari', sublabel: 'Severe / Critical', emoji: '🚨' },
];

const VICTIM_COUNTS = [
  { id: '1', label: '1 person' },
  { id: '2-3', label: '2 – 3 people' },
  { id: '4+', label: '4+ people' },
];

const DEATH_CIRCUMSTANCES = [
  { id: 'trampling', label: 'Trampling / Kukanyagwa', emoji: '🦶' },
  { id: 'farming_encounter', label: 'During Farming / Shambani', emoji: '🌱' },
  { id: 'night_encounter', label: 'Night Encounter / Usiku', emoji: '🌙' },
  { id: 'other', label: 'Other / Nyingine', emoji: '📝' },
];

export default function ReportScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const config = alertTypes[type as keyof typeof alertTypes];

  // Common state
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Sighting
  const [elephantCount, setElephantCount] = useState<string | null>(null);

  // Property damage
  const [damageTypes, setDamageTypes] = useState<string[]>([]);
  const [severity, setSeverity] = useState<string | null>(null);

  // Human injury
  const [injurySeverity, setInjurySeverity] = useState<string | null>(null);
  const [victimCount, setVictimCount] = useState<string | null>(null);
  const [medicalHelp, setMedicalHelp] = useState<boolean | null>(null);

  // Human death
  const [deathCount, setDeathCount] = useState<string | null>(null);
  const [circumstances, setCircumstances] = useState<string | null>(null);
  const [authoritiesNotified, setAuthoritiesNotified] = useState<boolean | null>(null);

  const toggleDamageType = (id: string) => {
    setDamageTypes((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        RNAlert.alert('Permission Denied', 'Location is required to send alerts.');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const userId = await AsyncStorage.getItem('userId');

      const alertData: Record<string, any> = {
        type,
        description: notes || `${config?.label} reported`,
        coordinates: {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        },
        timestamp: serverTimestamp(),
        status: 'active',
        reportedBy: userId || 'unknown',
        village: 'Unknown',
        notes: notes || null,
        imageUrl: image || null,
      };

      // Add type-specific fields
      if (type === 'sighting') {
        alertData.elephantCount = elephantCount;
      } else if (type === 'property_damage') {
        alertData.damageTypes = damageTypes;
        alertData.severity = severity;
      } else if (type === 'human_injury') {
        alertData.injurySeverity = injurySeverity;
        alertData.victimCount = victimCount;
        alertData.medicalHelpNeeded = medicalHelp;
      } else if (type === 'human_death') {
        alertData.deathCount = deathCount;
        alertData.circumstances = circumstances;
        alertData.authoritiesNotified = authoritiesNotified;
      }

      await addDoc(collection(db, 'alerts'), alertData);
      RNAlert.alert('✅ Report Sent', 'Your report has been submitted successfully. Rangers will be notified.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error('Error sending alert:', error);
      RNAlert.alert('Error', 'Failed to send report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!config) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: '#f0f4f8' }}>
        <Text className="text-slate-500">Unknown report type</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1"
      style={{ backgroundColor: '#f0f4f8' }}
    >
      {/* Header */}
      <View
        style={{
          paddingTop: 52,
          paddingBottom: 16,
          paddingHorizontal: 20,
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderBottomWidth: 0.5,
          borderBottomColor: 'rgba(0,0,0,0.06)',
        }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text className="text-primary-600 text-base font-semibold">← Back</Text>
          </TouchableOpacity>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              backgroundColor: `${config.color}15`,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text className="text-xl">{config.emoji}</Text>
          </View>
        </View>
        <Text className="text-xl font-bold text-slate-900 mt-3">{config.label}</Text>
        <Text className="text-sm text-slate-400">{config.swahili}</Text>
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }}
      >
        {/* ── SIGHTING FORM ── */}
        {type === 'sighting' && (
          <SectionCard title="🐘 How many elephants? / Tembo wangapi?">
            <View style={{ gap: 8 }}>
              {SIGHTING_COUNTS.map((item) => (
                <CheckOption
                  key={item.id}
                  label={`${item.emoji}  ${item.label}`}
                  selected={elephantCount === item.id}
                  onPress={() => setElephantCount(item.id)}
                  color={config.color}
                />
              ))}
            </View>
          </SectionCard>
        )}

        {/* ── PROPERTY DAMAGE FORM ── */}
        {type === 'property_damage' && (
          <>
            <SectionCard title="🏚️ Type of Damage / Aina ya Uharibifu">
              <View style={{ gap: 8 }}>
                {DAMAGE_TYPES.map((item) => (
                  <CheckOption
                    key={item.id}
                    label={`${item.emoji}  ${item.label}`}
                    selected={damageTypes.includes(item.id)}
                    onPress={() => toggleDamageType(item.id)}
                    color={config.color}
                    multi
                  />
                ))}
              </View>
            </SectionCard>

            <SectionCard title="📊 Severity / Uzito wa Madhara">
              <View style={{ gap: 8 }}>
                {SEVERITY_LEVELS.map((item) => (
                  <CheckOption
                    key={item.id}
                    label={`${item.label}  •  ${item.sublabel}`}
                    selected={severity === item.id}
                    onPress={() => setSeverity(item.id)}
                    color={item.color}
                  />
                ))}
              </View>
            </SectionCard>
          </>
        )}

        {/* ── HUMAN INJURY FORM ── */}
        {type === 'human_injury' && (
          <>
            <SectionCard title="🩹 Injury Severity / Kiwango cha Jeraha">
              <View style={{ gap: 8 }}>
                {INJURY_SEVERITY.map((item) => (
                  <CheckOption
                    key={item.id}
                    label={`${item.emoji}  ${item.label}  •  ${item.sublabel}`}
                    selected={injurySeverity === item.id}
                    onPress={() => setInjurySeverity(item.id)}
                    color={config.color}
                  />
                ))}
              </View>
            </SectionCard>

            <SectionCard title="👥 Number of Victims / Idadi ya Waathirika">
              <View style={{ gap: 8 }}>
                {VICTIM_COUNTS.map((item) => (
                  <CheckOption
                    key={item.id}
                    label={item.label}
                    selected={victimCount === item.id}
                    onPress={() => setVictimCount(item.id)}
                    color={config.color}
                  />
                ))}
              </View>
            </SectionCard>

            <SectionCard title="🚑 Medical Help Needed? / Msaada wa Matibabu?">
              <View className="flex-row" style={{ gap: 10 }}>
                <ToggleButton
                  label="✅ Yes / Ndiyo"
                  active={medicalHelp === true}
                  onPress={() => setMedicalHelp(true)}
                  color="#16a34a"
                />
                <ToggleButton
                  label="❌ No / Hapana"
                  active={medicalHelp === false}
                  onPress={() => setMedicalHelp(false)}
                  color="#64748b"
                />
              </View>
            </SectionCard>
          </>
        )}

        {/* ── HUMAN DEATH FORM ── */}
        {type === 'human_death' && (
          <>
            <SectionCard title="☠️ Number of Deaths / Idadi ya Vifo">
              <View style={{ gap: 8 }}>
                {VICTIM_COUNTS.map((item) => (
                  <CheckOption
                    key={item.id}
                    label={item.label}
                    selected={deathCount === item.id}
                    onPress={() => setDeathCount(item.id)}
                    color={config.color}
                  />
                ))}
              </View>
            </SectionCard>

            <SectionCard title="📋 Circumstances / Hali Iliyotokea">
              <View style={{ gap: 8 }}>
                {DEATH_CIRCUMSTANCES.map((item) => (
                  <CheckOption
                    key={item.id}
                    label={`${item.emoji}  ${item.label}`}
                    selected={circumstances === item.id}
                    onPress={() => setCircumstances(item.id)}
                    color={config.color}
                  />
                ))}
              </View>
            </SectionCard>

            <SectionCard title="🚔 Authorities Notified? / Mamlaka Wamejulishwa?">
              <View className="flex-row" style={{ gap: 10 }}>
                <ToggleButton
                  label="✅ Yes / Ndiyo"
                  active={authoritiesNotified === true}
                  onPress={() => setAuthoritiesNotified(true)}
                  color="#16a34a"
                />
                <ToggleButton
                  label="❌ No / Hapana"
                  active={authoritiesNotified === false}
                  onPress={() => setAuthoritiesNotified(false)}
                  color="#64748b"
                />
              </View>
            </SectionCard>
          </>
        )}

        {/* ── COMMON: Image Upload ── */}
        <SectionCard title="📸 Photo Evidence / Picha ya Ushahidi">
          <ImagePicker image={image} onImageSelected={(uri) => setImage(uri || null)} />
        </SectionCard>

        {/* ── COMMON: Voice Note ── */}
        <SectionCard title="🎙️ Voice Report / Ripoti kwa Sauti">
          <VoiceRecorder />
        </SectionCard>

        {/* ── COMMON: Notes ── */}
        <SectionCard title="📝 Notes / Maelezo Zaidi">
          <TextInput
            className="text-slate-900 text-base"
            placeholder="Describe what happened... / Elezea kilichotokea..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            style={{
              backgroundColor: '#f8fafc',
              borderRadius: 14,
              padding: 14,
              minHeight: 100,
              textAlignVertical: 'top',
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.06)',
            }}
          />
        </SectionCard>

        {/* ── SUBMIT ── */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
          style={{
            backgroundColor: config.color,
            borderRadius: 20,
            paddingVertical: 18,
            alignItems: 'center',
            marginTop: 8,
            shadowColor: config.color,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
            opacity: loading ? 0.7 : 1,
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          {loading ? (
            <>
              <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
              <Text className="text-white text-base font-bold">Sending Report...</Text>
            </>
          ) : (
            <Text className="text-white text-base font-bold">
              Submit Report / Tuma Ripoti  →
            </Text>
          )}
        </TouchableOpacity>

        {/* GPS notice */}
        <View className="items-center mt-3 mb-4">
          <Text className="text-[11px] text-slate-400">
            📍 GPS location will be attached automatically
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Reusable Components ──────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: 'rgba(255,255,255,0.92)',
        borderRadius: 18,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      <Text className="text-sm font-bold text-slate-700 mb-3">{title}</Text>
      {children}
    </View>
  );
}

function CheckOption({
  label,
  selected,
  onPress,
  color,
  multi = false,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  color: string;
  multi?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 14,
        backgroundColor: selected ? `${color}10` : '#f8fafc',
        borderWidth: 1.5,
        borderColor: selected ? `${color}40` : 'rgba(0,0,0,0.06)',
      }}
    >
      {/* Checkbox / Radio indicator */}
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: multi ? 6 : 11,
          borderWidth: 2,
          borderColor: selected ? color : '#cbd5e1',
          backgroundColor: selected ? color : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}
      >
        {selected && (
          <Text className="text-white text-xs font-bold">✓</Text>
        )}
      </View>
      <Text
        className="text-sm font-medium flex-1"
        style={{ color: selected ? '#1e293b' : '#64748b' }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function ToggleButton({
  label,
  active,
  onPress,
  color,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  color: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        backgroundColor: active ? `${color}15` : '#f8fafc',
        borderWidth: 1.5,
        borderColor: active ? `${color}40` : 'rgba(0,0,0,0.06)',
      }}
    >
      <Text
        className="text-sm font-semibold"
        style={{ color: active ? color : '#94a3b8' }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
