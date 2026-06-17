// Shown when the scanned food is a DISH: the ingredients needed to make it.

import { StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/colors';

type Props = {
  ingredients: string[];
};

export function IngredientsList({ ingredients }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>WHAT'S INSIDE</Text>
      <Text style={styles.subheading}>INGREDIENTS</Text>

      <View style={styles.list}>
        {ingredients.map((item, index) => (
          <View key={index} style={styles.row}>
            <View style={styles.dot} />
            <Text style={styles.item}>{item}</Text>
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
  item: {
    fontSize: 16,
    color: AppColors.text,
  },
});
