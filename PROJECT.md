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
| Framework | React Native + Expo (SDK 56) | Managed workflow |
| Language | TypeScript | Keep types simple; no complex generics |
| Navigation | Expo Router (file-based) | Screens live in `src/app/` |
| Camera | `expo-image-picker` | **Not yet installed** — run `npx expo install expo-image-picker` |
| AI | OpenAI `gpt-4o` | Vision-capable; send image as base64 |
| Env vars | `.env` + `process.env.EXPO_PUBLIC_*` | Key must use the `EXPO_PUBLIC_` prefix to be readable in the app |
| Styling | React Native `StyleSheet` | No external UI library needed |

> The Expo app lives in the **`food-scanner/`** subfolder. Run all `npx expo` commands from inside it.
> Expo SDK 56 changed a lot — check the versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing Expo-specific code.

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

**API call shape:**
```ts
const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
  },
  body: JSON.stringify({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: NUTRITION_PROMPT },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64}` } },
        ],
      },
    ],
    max_tokens: 500,
  }),
});
```

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

All app code lives under `food-scanner/src/`.

| File | Responsibility | Exists? |
|---|---|---|
| `src/app/index.tsx` | Camera/picker UI, triggers API call, handles loading/error states | ✅ (from template — needs rewrite) |
| `src/app/result.tsx` | Receives navigation params, renders results | ❌ to create |
| `src/components/FoodCard.tsx` | Displays food name, calorie count, and macros | ❌ to create |
| `src/components/RecipeList.tsx` | Renders a list of recipe name strings | ❌ to create |
| `src/services/openai.ts` | `analyzeFood(base64: string)` — the only place OpenAI is called | ❌ to create |
| `src/constants/prompts.ts` | Exports `NUTRITION_PROMPT` string | ❌ to create |
| `.env` | `EXPO_PUBLIC_OPENAI_API_KEY=sk-...` (git-ignored) | ✅ created |
| `.env.example` | Safe template committed to git | ✅ created |

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

- File names: `PascalCase` for components, `camelCase` for services/constants.
- Keep each component under ~80 lines.
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
- [ ] `expo-image-picker` installed (`npx expo install expo-image-picker`)
- [ ] `src/services/openai.ts` written and tested
- [ ] `src/constants/prompts.ts` created
- [ ] Home screen UI (rewrite `src/app/index.tsx`)
- [ ] Result screen UI (`src/app/result.tsx`)
- [ ] Demo walkthrough rehearsed
