import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Home - TranslatBot' }} />
      <Stack.Screen name="ChatScreen" options={{ title: 'Chat - TranslatBot' }} />
    </Stack>
  );
}
