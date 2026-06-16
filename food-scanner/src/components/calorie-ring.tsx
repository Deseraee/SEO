// The circular calorie ring (the hero element from the design reference).
// Drawn with react-native-svg: a gray full circle (the track) with a green
// arc on top showing the calorie value.

import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { AppColors } from '@/constants/colors';

type Props = {
  calories: number;
};

const SIZE = 170;          // overall width/height of the ring
const STROKE = 16;         // thickness of the ring
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function CalorieRing({ calories }: Props) {
  // Fill the ring proportionally, treating 1000 cal as a "full" ring.
  // (Purely visual — calories can go above 1000, we just cap the fill at 100%.)
  const fillPercent = Math.min(calories / 1000, 1);
  const dashOffset = CIRCUMFERENCE * (1 - fillPercent);

  return (
    <View style={styles.wrap}>
      <Svg width={SIZE} height={SIZE}>
        {/* Gray background track */}
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={AppColors.ringTrack}
          strokeWidth={STROKE}
          fill="none"
        />
        {/* Green progress arc. Rotated -90deg so it starts at the top. */}
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={AppColors.green}
          strokeWidth={STROKE}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </Svg>

      {/* The number sits in the center of the ring */}
      <View style={styles.center}>
        <Text style={styles.calories}>{calories.toLocaleString()}</Text>
        <Text style={styles.label}>calories</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calories: {
    fontSize: 34,
    fontWeight: '700',
    color: AppColors.green,
  },
  label: {
    fontSize: 13,
    color: AppColors.muted,
  },
});
