# CLAUDE.md — AI Build Reference for NutriSnap

This file is the authoritative reference for how Claude should help build this project.
Read this before generating any code.

---

## Project Summary

**NutriSnap** is a React Native / Expo demo app that:
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
| Framework | React Native + Expo (SDK 51+) | Managed workflow |
| Navigation | Expo Router (file-based) | Screens live in `app/` |
| Camera | `expo-image-picker` | Simplest API for camera + gallery |
| AI | OpenAI `gpt-4o` | Vision-capable; send image as base64 |
| Env vars | `expo-constants` + `.env` | Use `process.env.EXPO_PUBLIC_*` prefix |
| Styling | React Native `StyleSheet` | No external UI library needed |

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

| File | Responsibility |
|---|---|
| `app/index.tsx` | Camera/picker UI, triggers API call, handles loading/error states |
| `app/result.tsx` | Receives navigation params, renders results |
| `components/FoodCard.tsx` | Displays food name, calorie count, and macros |
| `components/RecipeList.tsx` | Renders a list of recipe name strings |
| `services/openai.ts` | `analyzeFood(base64: string)` — the only place OpenAI is called |
| `constants/prompts.ts` | Exports `NUTRITION_PROMPT` string |
| `.env` | `EXPO_PUBLIC_OPENAI_API_KEY=sk-...` |

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

## Current Status

- [ ] Project initialized (`npx create-expo-app`)
- [ ] Folder structure created
- [ ] `expo-image-picker` installed and configured
- [ ] `services/openai.ts` written and tested
- [ ] Home screen UI complete
- [ ] Result screen UI complete
- [ ] Demo walkthrough rehearsed
