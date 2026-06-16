# SEO — AI Food Nutrition Scanner

A React Native / Expo mobile app that uses the OpenAI Vision API to identify food from photos, return calorie counts, and suggest recipes.

---

## What It Does

1. **Snap or upload** a photo of any food.
2. **AI identifies** what the food is using GPT-4o Vision.
3. **Nutrition summary** — calories, macros, and a serving-size estimate are displayed.
4. **Recipes** — a short list of recipes that feature the identified food.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile app | React Native + Expo (SDK 56), TypeScript |
| AI | OpenAI API — `gpt-4o` with vision |
| Camera | `expo-image-picker` |
| Networking | `fetch` |
| State | React `useState` |
| Styling | React Native StyleSheet |

---

## Project Structure (planned)

```
food-scanner/              # the Expo app (run npx commands from here)
├── src/
│   ├── app/               # Expo Router screens (file-based routing)
│   │   ├── index.tsx      # Home / camera screen
│   │   └── result.tsx     # Nutrition results screen
│   ├── components/
│   │   ├── FoodCard.tsx   # Displays identified food + calories
│   │   └── RecipeList.tsx # Recipe suggestions
│   ├── services/
│   │   └── openai.ts      # OpenAI API call (image → nutrition)
│   └── constants/
│       └── prompts.ts     # System prompt sent to GPT-4o
├── assets/                # Icons, splash screen
├── .env                   # EXPO_PUBLIC_OPENAI_API_KEY (git-ignored)
├── .env.example           # Safe template (committed)
├── app.json               # Expo config
└── package.json
```

---

## Key Features

- **Camera integration** — take a photo in-app or pick from the library.
- **Base64 image encoding** — images are sent to OpenAI Vision as base64 data URLs.
- **Structured AI response** — the prompt asks GPT-4o to return JSON with `food`, `calories`, `macros`, and `recipes`.
- **Clean results UI** — a card-based screen shows the breakdown clearly.

---

## Getting Started

```bash
# 1. Move into the app folder
cd food-scanner

# 2. Install dependencies
npm install

# 3. Add your OpenAI key
cp .env.example .env        # then paste your real key into .env

# 4. Install the camera library
npx expo install expo-image-picker

# 5. Start Expo dev server
npx expo start
```

Scan the QR code with **Expo Go** on your phone.

---

## Environment Variables

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_OPENAI_API_KEY` | Your OpenAI secret key (get from platform.openai.com). The `EXPO_PUBLIC_` prefix is required for Expo to read it. |

`.env` is git-ignored and never committed. Only `.env.example` (a placeholder) is tracked.

---

## Demo Goals

- [ ] Camera screen that captures a food photo
- [ ] Call OpenAI Vision API with the image
- [ ] Parse and display food name + calorie count
- [ ] Show 2–3 recipe suggestions
- [ ] Clean, presentable UI for demo day
