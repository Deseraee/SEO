// The "FAST & EASY RECIPES" card — a simple list of recipe name strings.

import { StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/colors';

type Props = {
  recipes: string[];
};

export function RecipeList({ recipes }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>FAST & EASY</Text>
      <Text style={styles.subheading}>RECIPES</Text>

      <View style={styles.list}>
        {recipes.map((recipe, index) => (
          <View key={index} style={styles.row}>
            <View style={styles.dot} />
            <Text style={styles.recipe}>{recipe}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.card,
    borderRadius: 18,
    padding: 20,
    gap: 4,
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
    marginBottom: 8,
  },
  list: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.green,
  },
  recipe: {
    fontSize: 16,
    color: AppColors.text,
  },
});
