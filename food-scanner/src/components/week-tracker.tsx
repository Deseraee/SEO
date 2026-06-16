// Weekly calorie tracker (synthetic — no data is saved or cached).
// Shows a bar per day of the week, like the reference design. Bars over the
// daily target turn red; today is highlighted with its label.

import { StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/colors';

const DAILY_TARGET = 2000; // synthetic calorie target used to color the bars
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Synthetic calories for each day. Not stored anywhere — just for the demo.
const SYNTHETIC_CALORIES = [1750, 1900, 2100, 1600, 2300, 1850, 1700];

// JS getDay(): 0 = Sunday ... 6 = Saturday. Convert so Monday = 0.
const todayIndex = (new Date().getDay() + 6) % 7;

const MAX_BAR_HEIGHT = 70;
const maxCalories = Math.max(...SYNTHETIC_CALORIES);

export function WeekTracker() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>This Week</Text>

      <View style={styles.chart}>
        {SYNTHETIC_CALORIES.map((calories, index) => {
          const isToday = index === todayIndex;
          const overTarget = calories > DAILY_TARGET;
          const barHeight = (calories / maxCalories) * MAX_BAR_HEIGHT;

          return (
            <View key={index} style={styles.column}>
              <View
                style={[
                  styles.bar,
                  { height: barHeight },
                  overTarget && styles.barOver,
                  isToday && styles.barToday,
                ]}
              />
              <Text style={[styles.day, isToday && styles.dayToday]}>
                {DAY_LABELS[index]}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.analysis}>
        <Text style={styles.analysisLabel}>My Analysis:</Text>
        <View style={styles.pill}>
          <Text style={styles.pillText}>On Target</Text>
        </View>
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
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: AppColors.text,
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: MAX_BAR_HEIGHT + 24,
  },
  column: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  bar: {
    width: 14,
    borderRadius: 4,
    backgroundColor: AppColors.green,
  },
  barOver: {
    backgroundColor: AppColors.red,
  },
  barToday: {
    width: 18,
  },
  day: {
    fontSize: 11,
    color: AppColors.muted,
  },
  dayToday: {
    color: AppColors.text,
    fontWeight: '700',
  },
  analysis: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#f0f1f3',
    paddingTop: 16,
  },
  analysisLabel: {
    fontSize: 14,
    color: AppColors.text,
  },
  pill: {
    backgroundColor: AppColors.greenSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.green,
  },
});
