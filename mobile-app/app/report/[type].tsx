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
  { id: 'food_store', label: 'Food Store / Ghala', emoji: '🏭' },
  { id: 'water_pipes', label: 'Water Pipes / Mihundo binu', emoji: '🚰' },
  { id: 'other', label: 'Other Properties / Mali Nyingine', emoji: '📝' },
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

const CROP_TYPES = [
  { id: 'maize', label: 'Maize / Mahindi', emoji: '🌽' },
  { id: 'rice', label: 'Rice / Mpunga', emoji: '🌾' },
  { id: 'banana', label: 'Banana / Ndizi', emoji: '🍌' },
  { id: 'cassava', label: 'Cassava / Muhogo', emoji: '🥔' },
  { id: 'vegetables', label: 'Vegetables / Mboga', emoji: '🥬' },
  { id: 'other', label: 'Other / Nyingine', emoji: '📝' },
];

const LIVESTOCK_TYPES = [
  { id: 'cattle', label: 'Cattle / Ng\'ombe', emoji: '🐄' },
  { id: 'goats', label: 'Goats / Mbuzi', emoji: '🐐' },
  { id: 'sheep', label: 'Sheep / Kondoo', emoji: '🐑' },
  { id: 'poultry', label: 'Poultry / Kuku', emoji: '🐔' },
  { id: 'other', label: 'Other / Nyingine', emoji: '📝' },
];

const LIVESTOCK_COUNTS = [
  { id: '1-2', label: '1 – 2' },
  { id: '3-5', label: '3 – 5' },
  { id: '5+', label: '5+' },
];

export default function ReportScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const config = alertTypes[type as keyof typeof alertTypes];

  // Common state
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isImmediateDanger, setIsImmediateDanger] = useState(
    type === 'human_injury' || type === 'human_death'
  );

  // Sighting
  const [elephantCount, setElephantCount] = useState<string | null>(null);

  // Property damage
  const [damageTypes, setDamageTypes] = useState<string[]>([]);
  const [severity, setSeverity] = useState<string | null>(null);
  const [otherPropertyText, setOtherPropertyText] = useState('');
  const [otherProperties, setOtherProperties] = useState<string[]>([]);

  // Human injury
  const [injurySeverity, setInjurySeverity] = useState<string | null>(null);
  const [medicalHelp, setMedicalHelp] = useState<boolean | null>(null);
  const [victims, setVictims] = useState<{ name: string; gender: string; age: string }[]>([]);
  const [victimName, setVictimName] = useState('');
  const [victimGender, setVictimGender] = useState<string | null>(null);
  const [victimAge, setVictimAge] = useState('');

  // Human death
  const [deathCount, setDeathCount] = useState<string | null>(null);
  const [circumstances, setCircumstances] = useState<string | null>(null);
  const [authoritiesNotified, setAuthoritiesNotified] = useState<boolean | null>(null);
  const [otherCircumstanceText, setOtherCircumstanceText] = useState('');
  const [otherCircumstances, setOtherCircumstances] = useState<string[]>([]);
  const [deceasedList, setDeceasedList] = useState<{ name: string; gender: string; age: string }[]>([]);
  const [deceasedName, setDeceasedName] = useState('');
  const [deceasedGender, setDeceasedGender] = useState<string | null>(null);
  const [deceasedAge, setDeceasedAge] = useState('');

  // Crop damage
  const [cropTypes, setCropTypes] = useState<string[]>([]);
  const [cropSeverity, setCropSeverity] = useState<string | null>(null);
  const [estimatedArea, setEstimatedArea] = useState('');
  const [otherCropText, setOtherCropText] = useState('');
  const [otherCrops, setOtherCrops] = useState<string[]>([]);

  // Livestock killing
  const [livestockTypes, setLivestockTypes] = useState<string[]>([]);
  const [livestockCount, setLivestockCount] = useState<string | null>(null);
  const [livestockSeverity, setLivestockSeverity] = useState<string | null>(null);
  const [otherLivestockText, setOtherLivestockText] = useState('');
  const [otherLivestock, setOtherLivestock] = useState<string[]>([]);

  const toggleDamageType = (id: string) => {
    setDamageTypes((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const toggleCropType = (id: string) => {
    setCropTypes((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const toggleLivestockType = (id: string) => {
    setLivestockTypes((prev) =>
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
        elephantCount: elephantCount || null,
        isImmediateDanger,
      };

      // Add type-specific fields
      if (type === 'property_damage') {
        alertData.damageTypes = damageTypes;
        alertData.severity = severity;
        if (otherProperties.length > 0) {
          alertData.otherProperties = otherProperties;
        }
      } else if (type === 'human_injury') {
        alertData.injurySeverity = injurySeverity;
        alertData.victimCount = String(victims.length);
        alertData.victims = victims;
        alertData.medicalHelpNeeded = medicalHelp;
      } else if (type === 'human_death') {
        alertData.deathCount = String(deceasedList.length || deathCount);
        alertData.deceased = deceasedList;
        alertData.circumstances = circumstances;
        alertData.authoritiesNotified = authoritiesNotified;
        if (otherCircumstances.length > 0) {
          alertData.otherCircumstances = otherCircumstances;
        }
      } else if (type === 'crop_damage') {
        alertData.cropTypes = cropTypes;
        alertData.cropSeverity = cropSeverity;
        alertData.estimatedAreaAcres = estimatedArea || null;
        if (otherCrops.length > 0) {
          alertData.otherCrops = otherCrops;
        }
      } else if (type === 'livestock_killing') {
        alertData.livestockTypes = livestockTypes;
        alertData.livestockCount = livestockCount;
        alertData.livestockSeverity = livestockSeverity;
        if (otherLivestock.length > 0) {
          alertData.otherLivestock = otherLivestock;
        }
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

        {/* ── SIGHTING FORM (no extra fields needed) ── */}
        {type === 'sighting' && (
          <SectionCard title="📝 Additional sighting details">
            <Text style={{ color: '#64748b', fontSize: 13 }}>
              Use the notes, photo, and voice sections below for more details.
            </Text>
          </SectionCard>
        )}

        {/* ── PROPERTY DAMAGE FORM ── */}
        {type === 'property_damage' && (
          <>
            <SectionCard title="🏠 Type of Damage / Aina ya Uharibifu">
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

                {/* Other Properties input */}
                {damageTypes.includes('other') && (
                  <View style={{ marginTop: 8 }}>
                    {/* List of added items */}
                    {otherProperties.map((prop, index) => (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          backgroundColor: `${config.color}10`,
                          borderRadius: 10,
                          paddingVertical: 10,
                          paddingHorizontal: 14,
                          marginBottom: 6,
                          borderWidth: 1,
                          borderColor: `${config.color}30`,
                        }}
                      >
                        <Text style={{ flex: 1, color: '#1e293b', fontSize: 14 }}>{prop}</Text>
                        <TouchableOpacity
                          onPress={() => setOtherProperties((prev) => prev.filter((_, i) => i !== index))}
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            backgroundColor: '#ef444420',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Text style={{ color: '#ef4444', fontSize: 14, fontWeight: '700' }}>×</Text>
                        </TouchableOpacity>
                      </View>
                    ))}

                    {/* Input + Add button */}
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TextInput
                        className="text-slate-900 text-sm"
                        placeholder="Type property name... / Andika jina la mali..."
                        placeholderTextColor="#94a3b8"
                        value={otherPropertyText}
                        onChangeText={setOtherPropertyText}
                        style={{
                          flex: 1,
                          backgroundColor: '#f8fafc',
                          borderRadius: 12,
                          paddingHorizontal: 14,
                          paddingVertical: 12,
                          borderWidth: 1,
                          borderColor: 'rgba(0,0,0,0.06)',
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          const trimmed = otherPropertyText.trim();
                          if (trimmed) {
                            setOtherProperties((prev) => [...prev, trimmed]);
                            setOtherPropertyText('');
                          }
                        }}
                        activeOpacity={0.7}
                        style={{
                          backgroundColor: config.color,
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 20 }}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
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

        {/* ── CROP DAMAGE FORM ── */}
        {type === 'crop_damage' && (
          <>
            <SectionCard title="🌾 Crop Type / Aina ya Mazao">
              <View style={{ gap: 8 }}>
                {CROP_TYPES.map((item) => (
                  <CheckOption
                    key={item.id}
                    label={`${item.emoji}  ${item.label}`}
                    selected={cropTypes.includes(item.id)}
                    onPress={() => toggleCropType(item.id)}
                    color={config.color}
                    multi
                  />
                ))}

                {/* Other Crops input */}
                {cropTypes.includes('other') && (
                  <View style={{ marginTop: 8 }}>
                    {otherCrops.map((crop, index) => (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          backgroundColor: `${config.color}10`,
                          borderRadius: 10,
                          paddingVertical: 10,
                          paddingHorizontal: 14,
                          marginBottom: 6,
                          borderWidth: 1,
                          borderColor: `${config.color}30`,
                        }}
                      >
                        <Text style={{ flex: 1, color: '#1e293b', fontSize: 14 }}>{crop}</Text>
                        <TouchableOpacity
                          onPress={() => setOtherCrops((prev) => prev.filter((_, i) => i !== index))}
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            backgroundColor: '#ef444420',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Text style={{ color: '#ef4444', fontSize: 14, fontWeight: '700' }}>×</Text>
                        </TouchableOpacity>
                      </View>
                    ))}

                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TextInput
                        className="text-slate-900 text-sm"
                        placeholder="Type crop name... / Andika jina la zao..."
                        placeholderTextColor="#94a3b8"
                        value={otherCropText}
                        onChangeText={setOtherCropText}
                        style={{
                          flex: 1,
                          backgroundColor: '#f8fafc',
                          borderRadius: 12,
                          paddingHorizontal: 14,
                          paddingVertical: 12,
                          borderWidth: 1,
                          borderColor: 'rgba(0,0,0,0.06)',
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          const trimmed = otherCropText.trim();
                          if (trimmed) {
                            setOtherCrops((prev) => [...prev, trimmed]);
                            setOtherCropText('');
                          }
                        }}
                        activeOpacity={0.7}
                        style={{
                          backgroundColor: config.color,
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 20 }}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </SectionCard>

            <SectionCard title="📊 Severity / Uzito wa Madhara">
              <View style={{ gap: 8 }}>
                {SEVERITY_LEVELS.map((item) => (
                  <CheckOption
                    key={item.id}
                    label={`${item.label}  •  ${item.sublabel}`}
                    selected={cropSeverity === item.id}
                    onPress={() => setCropSeverity(item.id)}
                    color={item.color}
                  />
                ))}
              </View>
            </SectionCard>

            <SectionCard title="📏 Estimated Farm Size / Ukubwa wa Shamba (Acres)">
              <TextInput
                className="text-slate-900 text-base"
                placeholder="e.g. 2.5 acres..."
                placeholderTextColor="#94a3b8"
                keyboardType="decimal-pad"
                value={estimatedArea}
                onChangeText={setEstimatedArea}
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: 14,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,0.06)',
                }}
              />
            </SectionCard>
          </>
        )}

        {/* ── LIVESTOCK KILLING FORM ── */}
        {type === 'livestock_killing' && (
          <>
            <SectionCard title="🐄 Livestock Type / Aina ya Mifugo">
              <View style={{ gap: 8 }}>
                {LIVESTOCK_TYPES.map((item) => (
                  <CheckOption
                    key={item.id}
                    label={`${item.emoji}  ${item.label}`}
                    selected={livestockTypes.includes(item.id)}
                    onPress={() => toggleLivestockType(item.id)}
                    color={config.color}
                    multi
                  />
                ))}

                {/* Other Livestock input */}
                {livestockTypes.includes('other') && (
                  <View style={{ marginTop: 8 }}>
                    {otherLivestock.map((item, index) => (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          backgroundColor: `${config.color}10`,
                          borderRadius: 10,
                          paddingVertical: 10,
                          paddingHorizontal: 14,
                          marginBottom: 6,
                          borderWidth: 1,
                          borderColor: `${config.color}30`,
                        }}
                      >
                        <Text style={{ flex: 1, color: '#1e293b', fontSize: 14 }}>{item}</Text>
                        <TouchableOpacity
                          onPress={() => setOtherLivestock((prev) => prev.filter((_, i) => i !== index))}
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            backgroundColor: '#ef444420',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Text style={{ color: '#ef4444', fontSize: 14, fontWeight: '700' }}>×</Text>
                        </TouchableOpacity>
                      </View>
                    ))}

                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TextInput
                        className="text-slate-900 text-sm"
                        placeholder="Type livestock name... / Andika jina la mfugo..."
                        placeholderTextColor="#94a3b8"
                        value={otherLivestockText}
                        onChangeText={setOtherLivestockText}
                        style={{
                          flex: 1,
                          backgroundColor: '#f8fafc',
                          borderRadius: 12,
                          paddingHorizontal: 14,
                          paddingVertical: 12,
                          borderWidth: 1,
                          borderColor: 'rgba(0,0,0,0.06)',
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          const trimmed = otherLivestockText.trim();
                          if (trimmed) {
                            setOtherLivestock((prev) => [...prev, trimmed]);
                            setOtherLivestockText('');
                          }
                        }}
                        activeOpacity={0.7}
                        style={{
                          backgroundColor: config.color,
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 20 }}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </SectionCard>

            <SectionCard title="📊 Number of Depredation / Idadi ya Mifugo Walioathirika">
              <View style={{ gap: 8 }}>
                {LIVESTOCK_COUNTS.map((item) => (
                  <CheckOption
                    key={item.id}
                    label={item.label}
                    selected={livestockCount === item.id}
                    onPress={() => setLivestockCount(item.id)}
                    color={config.color}
                  />
                ))}
              </View>
            </SectionCard>

            <SectionCard title="🚨 Severity / Uzito wa Madhara">
              <View style={{ gap: 8 }}>
                {SEVERITY_LEVELS.map((item) => (
                  <CheckOption
                    key={item.id}
                    label={`${item.label}  •  ${item.sublabel}`}
                    selected={livestockSeverity === item.id}
                    onPress={() => setLivestockSeverity(item.id)}
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
            <SectionCard title="👥 Victims / Waathirika">
              {/* List of added victims */}
              {victims.map((v, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: `${config.color}10`,
                    borderRadius: 10,
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    marginBottom: 6,
                    borderWidth: 1,
                    borderColor: `${config.color}30`,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#1e293b', fontSize: 14, fontWeight: '600' }}>{v.name}</Text>
                    <Text style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>
                      {v.gender === 'male' ? '♂️ Male' : '♀️ Female'} • Age: {v.age}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setVictims((prev) => prev.filter((_, i) => i !== index))}
                    style={{
                      width: 24, height: 24, borderRadius: 12,
                      backgroundColor: '#ef444420',
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: '#ef4444', fontSize: 14, fontWeight: '700' }}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}

              {/* Victim input form */}
              <View style={{ gap: 10, marginTop: victims.length > 0 ? 8 : 0 }}>
                <TextInput
                  placeholder="Name / Jina..."
                  placeholderTextColor="#94a3b8"
                  value={victimName}
                  onChangeText={setVictimName}
                  style={{
                    backgroundColor: '#f8fafc', borderRadius: 12,
                    paddingHorizontal: 14, paddingVertical: 12,
                    borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
                    color: '#1e293b', fontSize: 14,
                  }}
                />

                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => setVictimGender('male')}
                    activeOpacity={0.7}
                    style={{
                      flex: 1, paddingVertical: 12, borderRadius: 12,
                      alignItems: 'center',
                      backgroundColor: victimGender === 'male' ? `${config.color}15` : '#f8fafc',
                      borderWidth: 1.5,
                      borderColor: victimGender === 'male' ? `${config.color}40` : 'rgba(0,0,0,0.06)',
                    }}
                  >
                    <Text style={{ color: victimGender === 'male' ? config.color : '#94a3b8', fontWeight: '600', fontSize: 14 }}>♂️ Male / Mme</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setVictimGender('female')}
                    activeOpacity={0.7}
                    style={{
                      flex: 1, paddingVertical: 12, borderRadius: 12,
                      alignItems: 'center',
                      backgroundColor: victimGender === 'female' ? `${config.color}15` : '#f8fafc',
                      borderWidth: 1.5,
                      borderColor: victimGender === 'female' ? `${config.color}40` : 'rgba(0,0,0,0.06)',
                    }}
                  >
                    <Text style={{ color: victimGender === 'female' ? config.color : '#94a3b8', fontWeight: '600', fontSize: 14 }}>♀️ Female / Mke</Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  placeholder="Age / Umri..."
                  placeholderTextColor="#94a3b8"
                  keyboardType="number-pad"
                  value={victimAge}
                  onChangeText={setVictimAge}
                  style={{
                    backgroundColor: '#f8fafc', borderRadius: 12,
                    paddingHorizontal: 14, paddingVertical: 12,
                    borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
                    color: '#1e293b', fontSize: 14,
                  }}
                />

                <TouchableOpacity
                  onPress={() => {
                    if (victimName.trim() && victimGender && victimAge.trim()) {
                      setVictims((prev) => [...prev, { name: victimName.trim(), gender: victimGender, age: victimAge.trim() }]);
                      setVictimName('');
                      setVictimGender(null);
                      setVictimAge('');
                    }
                  }}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: config.color, borderRadius: 12,
                    paddingVertical: 14, alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>+ Add Victim / Ongeza Mwathirika</Text>
                </TouchableOpacity>
              </View>

              {victims.length > 0 && (
                <Text style={{ color: '#64748b', fontSize: 12, marginTop: 6, textAlign: 'center' }}>
                  {victims.length} victim{victims.length > 1 ? 's' : ''} added
                </Text>
              )}
            </SectionCard>

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
            <SectionCard title="☠️ Deceased / Waliofariki">
              {/* List of added deceased */}
              {deceasedList.map((d, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: `${config.color}10`,
                    borderRadius: 10,
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    marginBottom: 6,
                    borderWidth: 1,
                    borderColor: `${config.color}30`,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#1e293b', fontSize: 14, fontWeight: '600' }}>{d.name}</Text>
                    <Text style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>
                      {d.gender === 'male' ? '♂️ Male' : '♀️ Female'} • Age: {d.age}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setDeceasedList((prev) => prev.filter((_, i) => i !== index))}
                    style={{
                      width: 24, height: 24, borderRadius: 12,
                      backgroundColor: '#ef444420',
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: '#ef4444', fontSize: 14, fontWeight: '700' }}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}

              {/* Deceased input form */}
              <View style={{ gap: 10, marginTop: deceasedList.length > 0 ? 8 : 0 }}>
                <TextInput
                  placeholder="Name / Jina..."
                  placeholderTextColor="#94a3b8"
                  value={deceasedName}
                  onChangeText={setDeceasedName}
                  style={{
                    backgroundColor: '#f8fafc', borderRadius: 12,
                    paddingHorizontal: 14, paddingVertical: 12,
                    borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
                    color: '#1e293b', fontSize: 14,
                  }}
                />

                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => setDeceasedGender('male')}
                    activeOpacity={0.7}
                    style={{
                      flex: 1, paddingVertical: 12, borderRadius: 12,
                      alignItems: 'center',
                      backgroundColor: deceasedGender === 'male' ? `${config.color}15` : '#f8fafc',
                      borderWidth: 1.5,
                      borderColor: deceasedGender === 'male' ? `${config.color}40` : 'rgba(0,0,0,0.06)',
                    }}
                  >
                    <Text style={{ color: deceasedGender === 'male' ? config.color : '#94a3b8', fontWeight: '600', fontSize: 14 }}>♂️ Male / Mme</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setDeceasedGender('female')}
                    activeOpacity={0.7}
                    style={{
                      flex: 1, paddingVertical: 12, borderRadius: 12,
                      alignItems: 'center',
                      backgroundColor: deceasedGender === 'female' ? `${config.color}15` : '#f8fafc',
                      borderWidth: 1.5,
                      borderColor: deceasedGender === 'female' ? `${config.color}40` : 'rgba(0,0,0,0.06)',
                    }}
                  >
                    <Text style={{ color: deceasedGender === 'female' ? config.color : '#94a3b8', fontWeight: '600', fontSize: 14 }}>♀️ Female / Mke</Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  placeholder="Age / Umri..."
                  placeholderTextColor="#94a3b8"
                  keyboardType="number-pad"
                  value={deceasedAge}
                  onChangeText={setDeceasedAge}
                  style={{
                    backgroundColor: '#f8fafc', borderRadius: 12,
                    paddingHorizontal: 14, paddingVertical: 12,
                    borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
                    color: '#1e293b', fontSize: 14,
                  }}
                />

                <TouchableOpacity
                  onPress={() => {
                    if (deceasedName.trim() && deceasedGender && deceasedAge.trim()) {
                      setDeceasedList((prev) => [...prev, { name: deceasedName.trim(), gender: deceasedGender, age: deceasedAge.trim() }]);
                      setDeceasedName('');
                      setDeceasedGender(null);
                      setDeceasedAge('');
                    }
                  }}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: config.color, borderRadius: 12,
                    paddingVertical: 14, alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>+ Add Person / Ongeza Mtu</Text>
                </TouchableOpacity>
              </View>

              {deceasedList.length > 0 && (
                <Text style={{ color: '#64748b', fontSize: 12, marginTop: 6, textAlign: 'center' }}>
                  {deceasedList.length} person{deceasedList.length > 1 ? 's' : ''} added
                </Text>
              )}
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

                {/* Other Circumstances input */}
                {circumstances === 'other' && (
                  <View style={{ marginTop: 8 }}>
                    {otherCircumstances.map((item, index) => (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          backgroundColor: `${config.color}10`,
                          borderRadius: 10,
                          paddingVertical: 10,
                          paddingHorizontal: 14,
                          marginBottom: 6,
                          borderWidth: 1,
                          borderColor: `${config.color}30`,
                        }}
                      >
                        <Text style={{ flex: 1, color: '#1e293b', fontSize: 14 }}>{item}</Text>
                        <TouchableOpacity
                          onPress={() => setOtherCircumstances((prev) => prev.filter((_, i) => i !== index))}
                          style={{
                            width: 24, height: 24, borderRadius: 12,
                            backgroundColor: '#ef444420',
                            alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <Text style={{ color: '#ef4444', fontSize: 14, fontWeight: '700' }}>×</Text>
                        </TouchableOpacity>
                      </View>
                    ))}

                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TextInput
                        className="text-slate-900 text-sm"
                        placeholder="Describe circumstance... / Eleza hali..."
                        placeholderTextColor="#94a3b8"
                        value={otherCircumstanceText}
                        onChangeText={setOtherCircumstanceText}
                        style={{
                          flex: 1, backgroundColor: '#f8fafc', borderRadius: 12,
                          paddingHorizontal: 14, paddingVertical: 12,
                          borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          const trimmed = otherCircumstanceText.trim();
                          if (trimmed) {
                            setOtherCircumstances((prev) => [...prev, trimmed]);
                            setOtherCircumstanceText('');
                          }
                        }}
                        activeOpacity={0.7}
                        style={{
                          backgroundColor: config.color, borderRadius: 12,
                          paddingHorizontal: 16,
                          alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 20 }}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
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

        {/* ── COMMON: Image Upload (not for human injury/death) ── */}
        {type !== 'human_injury' && type !== 'human_death' && (
          <SectionCard title="📸 Photo Evidence / Picha ya Ushahidi">
            <ImagePicker image={image} onImageSelected={(uri) => setImage(uri || null)} />
          </SectionCard>
        )}

        {/* ── COMMON: Voice Note ── */}
        <SectionCard title="🎙️ Voice Report / Ripoti kwa Sauti">
          <VoiceRecorder />
        </SectionCard>

        {/* ── COMMON: Elephant Count (all types) ── */}
        <SectionCard title="🐘 How many Elephants involved? / Tembo wangapi wamehusika?">
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

        {/* ── COMMON: Immediate Danger Selector ── */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#334155', marginBottom: 8 }}>
            🚨 Report Priority / Kipaumbele cha Ripoti
          </Text>
          
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {/* Normal Priority Option */}
            <TouchableOpacity
              onPress={() => setIsImmediateDanger(false)}
              activeOpacity={0.8}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: !isImmediateDanger ? '#eafaf1' : '#f1f5f9',
                borderRadius: 14,
                paddingVertical: 14,
                borderWidth: 2,
                borderColor: !isImmediateDanger ? '#22c55e' : 'rgba(0,0,0,0.05)',
                shadowColor: '#22c55e',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: !isImmediateDanger ? 0.08 : 0,
                shadowRadius: 4,
                elevation: !isImmediateDanger ? 2 : 0,
              }}
            >
              <Text style={{ fontSize: 16, marginRight: 6 }}>🟢</Text>
              <View>
                <Text style={{ color: !isImmediateDanger ? '#15803d' : '#64748b', fontWeight: '700', fontSize: 13 }}>
                  Normal / Kawaida
                </Text>
              </View>
            </TouchableOpacity>

            {/* Immediate Danger Option */}
            <TouchableOpacity
              onPress={() => setIsImmediateDanger(true)}
              activeOpacity={0.8}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isImmediateDanger ? '#fef2f2' : '#f1f5f9',
                borderRadius: 14,
                paddingVertical: 14,
                borderWidth: 2,
                borderColor: isImmediateDanger ? '#ef4444' : 'rgba(0,0,0,0.05)',
                shadowColor: '#ef4444',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isImmediateDanger ? 0.12 : 0,
                shadowRadius: 4,
                elevation: isImmediateDanger ? 2 : 0,
              }}
            >
              <Text style={{ fontSize: 16, marginRight: 6 }}>🚨</Text>
              <View>
                <Text style={{ color: isImmediateDanger ? '#b91c1c' : '#64748b', fontWeight: '700', fontSize: 13 }}>
                  Danger / Dharura
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Context Explanatory Banner */}
          <View
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 12,
              backgroundColor: isImmediateDanger ? '#fef2f2' : '#f0fdf4',
              borderWidth: 1,
              borderColor: isImmediateDanger ? '#fee2e2' : '#dcfce7',
            }}
          >
            <Text style={{ color: isImmediateDanger ? '#b91c1c' : '#15803d', fontSize: 12, lineHeight: 18, fontWeight: '500' }}>
              {isImmediateDanger 
                ? '⚠️ CRITICAL EMERGENCY: This will immediately trigger SMS warnings to rangers and emergency dispatchers for rapid response.'
                : '✅ Standard Report: For monitoring and mapping. Rangers will review this report as part of standard operations.'
              }
            </Text>
            <Text style={{ color: isImmediateDanger ? '#ef4444' : '#16a34a', fontSize: 10, marginTop: 4, fontStyle: 'italic' }}>
              {isImmediateDanger
                ? 'DHARURA KUBWA: Ujumbe wa dharura utatumwa kwa askari sasa hivi kwa ajili ya usaidizi wa haraka.'
                : 'RIPOTI YA KAWAIDA: Inatumika kwa ufuatiliaji wa kawaida. Askari wataiona wakati wa doria.'
              }
            </Text>
          </View>
        </View>

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
