// The Result screen. Track A's home screen navigates here after a successful
// scan, passing the food data as a JSON string param:
//
//   router.push({ pathname: '/result', params: { data: JSON.stringify(result) } });
//
// This screen parses that param and renders the cards.

import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FoodCard } from '@/components/food-card';
import { RecipeList } from '@/components/recipe-list';
import { AppColors } from '@/constants/colors';
import type { FoodResult } from '@/services/openai';

export default function ResultScreen() {
  // Grab the "data" param that the home screen passed in.
  const { data } = useLocalSearchParams<{ data?: string }>();

  // If we somehow landed here without data, show a friendly message.
  if (!data) {
    return (
      <SafeAreaView style={styles.empty}>
        <Text style={styles.emptyText}>No food data. Try scanning again.</Text>
        <ScanAgainButton />
      </SafeAreaView>
    );
  }

  const result: FoodResult = JSON.parse(data);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <FoodCard result={result} />
        <RecipeList recipes={result.recipes} />
        <ScanAgainButton />
      </ScrollView>
    </SafeAreaView>
  );
}

// Sends the user back to the home/scan screen.
function ScanAgainButton() {
  return (
    <Pressable style={styles.button} onPress={() => router.back()}>
      <Text style={styles.buttonText}>Scan Again</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: AppColors.page,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  empty: {
    flex: 1,
    backgroundColor: AppColors.page,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: AppColors.muted,
    textAlign: 'center',
  },
  button: {
    backgroundColor: AppColors.green,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
