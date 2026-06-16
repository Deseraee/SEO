// App color palette — based on the calorie-tracker design reference.
// Kept separate from theme.ts (the template's light/dark colors) so the two
// don't collide while both tracks are working.

export const AppColors = {
  green: '#43b649',       // primary accent: top bar, calorie ring
  greenSoft: '#e8f5e9',   // light green pill background
  blue: '#2f7bd6',        // stat numbers (calories, macros)
  red: '#e8604c',         // "over budget" / warning
  orange: '#f08a24',      // recipes label
  text: '#1a1a1a',        // primary text
  muted: '#9aa0a6',       // labels, secondary text
  page: '#eceef1',        // screen background
  card: '#ffffff',        // white cards
  ringTrack: '#e9ebee',   // unfilled part of the calorie ring
} as const;
