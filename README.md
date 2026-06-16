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
| Mobile app | React Native + Expo (SDK 51+) |
| AI | OpenAI API — `gpt-4o` with vision |
| Camera | `expo-camera` / `expo-image-picker` |
| Networking | `fetch` / `axios` |
| State | React `useState` / `useContext` |
| Styling | React Native StyleSheet |

---

## Project Structure (planned)

```
seo/
├── app/                  # Expo Router screens
│   ├── index.tsx         # Home / camera screen
│   └── result.tsx        # Nutrition results screen
├── components/
│   ├── FoodCard.tsx      # Displays identified food + calories
│   └── RecipeList.tsx    # Scrollable recipe suggestions
├── services/
│   └── openai.ts         # OpenAI API calls (image → nutrition)
├── constants/
│   └── prompts.ts        # System prompts sent to GPT-4o
├── assets/               # Icons, splash screen
├── .env                  # OPENAI_API_KEY (never committed)
├── app.json              # Expo config
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
# 1. Install dependencies
npm install

# 2. Add your OpenAI key
echo "OPENAI_API_KEY=sk-..." > .env

# 3. Start Expo dev server
npx expo start
```

Scan the QR code with **Expo Go** on your phone.

---

## Environment Variables

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | Your OpenAI secret key (get from platform.openai.com) |

Never commit `.env` to git.

---

## Demo Goals

- [ ] Camera screen that captures a food photo
- [ ] Call OpenAI Vision API with the image
- [ ] Parse and display food name + calorie count
- [ ] Show 2–3 recipe suggestions
- [ ] Clean, presentable UI for demo day
