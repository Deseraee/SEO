// The "FAST & EASY RECIPES" card. Each recipe shows its name, a short
// description, and small meta chips (time, calories, difficulty).

import { StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/colors';
import type { Recipe } from '@/services/openai';

type Props = {
  recipes: Recipe[];
};

export function RecipeList({ recipes }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>FAST & EASY</Text>
      <Text style={styles.subheading}>RECIPES</Text>

      <View style={styles.list}>
        {recipes.map((recipe, index) => (
          <View key={index} style={styles.recipe}>
            <Text style={styles.name}>{recipe.name}</Text>
            <Text style={styles.description}>{recipe.description}</Text>

            <View style={styles.chips}>
              <Chip label={`${recipe.time_minutes} min`} />
              <Chip label={`${recipe.calories} cal`} />
              <Chip label={recipe.difficulty} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

// A small rounded label for a single piece of recipe metadata.
function Chip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.card,
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: AppColors.text,
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.orange,
    letterSpacing: 1,
    marginBottom: 16,
  },
  list: {
    gap: 16,
  },
  recipe: {
    borderTopWidth: 1,
    borderTopColor: '#f0f1f3',
    paddingTop: 14,
    gap: 6,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: AppColors.text,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: AppColors.muted,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  chip: {
    backgroundColor: AppColors.greenSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.green,
  },
});
