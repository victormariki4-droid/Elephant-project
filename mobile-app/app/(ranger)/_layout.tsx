import { Stack } from 'expo-router';

export default function RangerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0f172a' },
      }}
    >
      <Stack.Screen name="missions" />
    </Stack>
  );
}
