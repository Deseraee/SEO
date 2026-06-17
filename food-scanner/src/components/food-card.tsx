// White card showing the identified food name, the calorie ring, and the
// three macros (protein / carbs / fat) as blue stat blocks.

import { StyleSheet, Text, View } from 'react-native';

import { CalorieRing } from '@/components/calorie-ring';
import { AppColors } from '@/constants/colors';
import type { FoodResult } from '@/services/openai';

type Props = {
  result: FoodResult;
};

// Capitalize the first letter of each word (e.g. "grilled salmon" -> "Grilled Salmon").
function titleCase(text: string) {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function FoodCard({ result }: Props) {
  // Label the food as a Dish or an Ingredient.
  const typeLabel = result.type === 'dish' ? 'Dish' : 'Ingredient';

  return (
    <View style={styles.card}>
      <Text style={styles.foodName}>{titleCase(result.food)}</Text>

      <View style={styles.typeBadge}>
        <Text style={styles.typeBadgeText}>{typeLabel}</Text>
      </View>

      <CalorieRing calories={result.calories} />

      <View style={styles.macros}>
        <Stat label="Protein" value={`${result.macros.protein_g}g`} />
        <Stat label="Carbs" value={`${result.macros.carbs_g}g`} />
        <Stat label="Fat" value={`${result.macros.fat_g}g`} />
      </View>
    </View>
  );
}

// A single macro stat (label on top, blue number below).
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.card,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    gap: 16,
    // soft shadow
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  foodName: {
    fontSize: 22,
    fontWeight: '700',
    color: AppColors.text,
    textAlign: 'center',
  },
  typeBadge: {
    backgroundColor: AppColors.greenSoft,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: -8,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.green,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  macros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'stretch',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: AppColors.muted,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.blue,
  },
});
