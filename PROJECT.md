# PROJECT.md — AI Build Reference

This file is the authoritative reference for how Claude should help build this project.
Read this before generating any code.

---

## Project Summary

This is a React Native / Expo demo app that:
1. Lets the user take or upload a photo of food.
2. Sends the image to OpenAI GPT-4o Vision.
3. Displays: identified food name, estimated calories, macros, and recipe ideas.

Target audience: demo / portfolio. Code should be **readable and explainable**, not over-engineered.

---

## Guiding Principles

- **Simple over clever.** This is a demo. Avoid abstractions, generics, or patterns that require explanation.
- **No backend.** All API calls go directly from the app to OpenAI. No server needed.
- **Expo managed workflow only.** Do not eject to bare React Native.
- **Comments are required here.** Because this is a learning/demo project, add short inline comments explaining *what* and *why* — opposite of the default Claude style.
- **No TypeScript strictness overkill.** Types are welcome but keep them simple; no complex generics.

---

## Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | React Native + Expo (**SDK 54**) | Managed workflow. Downgraded from the scaffolded SDK 56 to match Expo Go (App Store maxes at SDK 54). |
| Language | TypeScript | Keep types simple; no complex generics |
| Navigation | Expo Router (file-based) | Screens live in `src/app/` |
| Camera | `expo-image-picker` | ✅ Installed |
| Ring graphic | `react-native-svg` | ✅ Installed — used for the calorie ring |
| AI | OpenAI `gpt-4o` | Vision-capable; send image as base64 |
| Env vars | `.env` + `process.env.EXPO_PUBLIC_*` | Key must use the `EXPO_PUBLIC_` prefix to be readable in the app |
| Styling | React Native `StyleSheet` | No external UI library needed |

> The Expo app lives in the **`food-scanner/`** subfolder. Run all `npx expo` commands from inside it.
> The project runs on **Expo SDK 54** — check the versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing Expo-specific code.
> ⚠️ Do NOT upgrade the Expo SDK past 54 — Expo Go can't run a newer SDK.

---

## OpenAI Integration Pattern

Images must be sent as base64-encoded data URLs. The call lives in `services/openai.ts`.

**Prompt structure to use:**
```
You are a nutrition expert. The user has sent you a photo of food.
Respond ONLY with valid JSON in this exact shape:
{
  "food": "string — name of the food identified",
  "calories": number — estimated calories per serving,
  "macros": {
    "protein_g": number,
    "carbs_g": number,
    "fat_g": number
  },
  "recipes": ["recipe name 1", "recipe name 2", "recipe name 3"]
}
If you cannot identify food in the image, return { "error": "Could not identify food." }
```

**Implemented in `src/services/openai.ts`** as `analyzeFood(base64)`. It uses
`response_format: { type: "json_object" }` so the model always returns parseable JSON.
The service also exports the shared data type both screens use:

```ts
export type FoodResult = {
  food: string;
  calories: number;
  macros: { protein_g: number; carbs_g: number; fat_g: number };
  recipes: string[];
};

export async function analyzeFood(base64: string): Promise<FoodResult>;
```

### The contract between the two screens
Home screen (Track A) calls `analyzeFood`, then navigates passing the result as a JSON string:

```ts
const result = await analyzeFood(base64);
router.push({ pathname: '/result', params: { data: JSON.stringify(result) } });
```

Result screen (Track B) reads `params.data` and parses it back into a `FoodResult`.

---

## Design / Visual Style

Inspired by a clean calorie-tracker dashboard reference. Borrow the *aesthetic*, not the
full dashboard widgets (no steps/water/weekly-chart — our app is just scan → result).

**Palette** (defined in `src/constants/colors.ts` as `AppColors`)
| Token | Color | Use |
|---|---|---|
| Primary green | `#43b649` | Top bar, calorie ring, accents |
| Stat blue | `#2f7bd6` | Numbers (calories, macros) |
| Background | `#eceef1` light gray | Screen background |
| Card | `#ffffff` | Rounded white cards with soft shadow |
| Text / muted | `#1a1a1a` / `#9aa0a6` | Headings / labels |
| Orange | `#f08a24` | "RECIPES" label |

**Visual language**
- White rounded cards (border-radius ~16, soft shadow) on a light gray background.
- Generous whitespace, clean sans-serif (system font is fine).
- **Calorie ring** — circular progress ring showing the food's calorie count as the
  hero element (mirrors the apple-ring in the reference). Use `react-native-svg` or a
  simple styled circle.
- Macros shown as small labeled stats (protein / carbs / fat) like the reference's
  side stats.
- Recipes in a bottom card with a "FAST & EASY RECIPES" style heading.

---

## Screen Flow

```
Home (index.tsx)
  └── User taps "Take Photo" or "Choose from Library"
  └── expo-image-picker returns base64 image
  └── App calls openai.ts → analyzeFood(base64)
  └── On success → navigate to result.tsx with parsed data

Result (result.tsx)
  └── Shows FoodCard (food name + calories + macros)
  └── Shows RecipeList (3 recipe names)
  └── "Scan Again" button → back to Home
```

---

## File Responsibilities

All app code lives under `food-scanner/src/`. Work is split into two tracks
(see "Work Split" below). File names use kebab-case to match the Expo template.

| File | Responsibility | Track | Exists? |
|---|---|---|---|
| `src/app/index.tsx` | Camera/picker UI, triggers API call, handles loading/error states | A | ⬜ template default — needs rewrite |
| `src/app/result.tsx` | Receives navigation params, renders results | B | ✅ done |
| `src/components/calorie-ring.tsx` | SVG calorie ring (hero element) | B | ✅ done |
| `src/components/food-card.tsx` | Food name + ring + macro stats | B | ✅ done |
| `src/components/recipe-list.tsx` | Renders the recipe name list | B | ✅ done |
| `src/services/openai.ts` | `analyzeFood(base64)` + the `FoodResult` type — only place OpenAI is called | B | ✅ done |
| `src/constants/prompts.ts` | Exports `NUTRITION_PROMPT` string | B | ✅ done |
| `src/constants/colors.ts` | `AppColors` palette | B | ✅ done |
| `.env` | `EXPO_PUBLIC_OPENAI_API_KEY=sk-...` (git-ignored) | — | ✅ created |
| `.env.example` | Safe template committed to git | — | ✅ created |

---

## Work Split

**Track A — Camera + App shell**
- Rewrite `src/app/index.tsx`: "Take Photo" / "Choose from Library" buttons via
  `expo-image-picker` (request `base64: true`), photo preview, loading + error states.
- Call `analyzeFood(base64)` from `@/services/openai`, then navigate to `/result`
  passing `data: JSON.stringify(result)` (see "The contract" above).

**Track B — AI + Results UI** (done)
- `services/openai.ts`, `constants/prompts.ts`, `constants/colors.ts`,
  `components/calorie-ring.tsx`, `components/food-card.tsx`, `components/recipe-list.tsx`,
  `app/result.tsx`.

---

## What NOT to Build

- No user accounts or auth.
- No database or history of past scans.
- No backend / server / API routes.
- No complex state management (Redux, Zustand, etc.).
- No tests (this is a demo).
- No dark mode toggle.

---

## Conventions

- File names: **kebab-case** for everything (e.g. `calorie-ring.tsx`) to match the Expo template.
- Import with the `@/` alias (e.g. `import { AppColors } from '@/constants/colors'`).
- Keep each component small and focused.
- Use `async/await`, not `.then()` chains.
- All API errors should surface a user-friendly message on screen, not just `console.error`.

---

## Security

- The API key lives ONLY in `food-scanner/.env`, which is git-ignored.
- Never paste the key into chat, commits, or screenshots.
- ⚠️ The current key was shared in chat once — **rotate it** at https://platform.openai.com/api-keys and paste the new one into `.env` directly.
- Set a low monthly usage limit on the OpenAI dashboard so a leaked key can't cause large charges.

---

## Current Status

- [x] Project initialized (`npx create-expo-app` → `food-scanner/`)
- [x] `.env` + `.env.example` created, `.gitignore` hardened
- [x] Downgraded to Expo SDK 54 (matches Expo Go)
- [x] `expo-image-picker` + `react-native-svg` installed
- [x] **Track B done:** OpenAI service, prompt, colors, result screen + components
- [ ] **Track A:** Home screen rewrite (`src/app/index.tsx`) — camera/picker + navigate to result
- [ ] Rotate the OpenAI API key (was shared in chat)
- [ ] End-to-end test: photo → real API call → result screen
- [ ] Demo walkthrough rehearsed
