import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack screenOptions={{
    headerTitle: "Home - Translatboot", // Titre spécifique à la page d'accueil
  }}/>;
}
