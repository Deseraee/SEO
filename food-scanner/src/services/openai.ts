// This file is the ONLY place we talk to OpenAI.
// It takes a base64 image and returns structured nutrition info.

import { NUTRITION_PROMPT } from '@/constants/prompts';

// ----- The shared data shape (the contract between Track A and Track B) -----
// Track A builds the home screen against this; Track B builds the result screen
// against it. Both import these types so they always agree.

export type Macros = {
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

// A single recipe with enough detail to show a useful card.
export type Recipe = {
  name: string;
  description: string;   // 1-2 sentence summary of the dish
  time_minutes: number;  // rough total cook + prep time
  calories: number;      // approx calories per serving
  difficulty: string;    // "Easy" | "Medium" | "Hard"
};

export type FoodResult = {
  food: string;
  calories: number;
  macros: Macros;
  recipes: Recipe[];
};

// The API key comes from the .env file. The EXPO_PUBLIC_ prefix is required
// for Expo to expose it to the running app.
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

/**
 * Send a food photo to GPT-4o and get back nutrition info.
 * @param base64 - the raw base64 string of the image (no "data:" prefix)
 */
export async function analyzeFood(base64: string): Promise<FoodResult> {
  if (!OPENAI_API_KEY) {
    throw new Error('Missing API key. Add EXPO_PUBLIC_OPENAI_API_KEY to your .env file.');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      // Forces the model to return valid JSON we can parse safely.
      response_format: { type: 'json_object' },
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: NUTRITION_PROMPT },
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${base64}` },
            },
          ],
        },
      ],
    }),
  });

  // If OpenAI returns an HTTP error (bad key, rate limit, etc.), surface it.
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('OpenAI returned an empty response.');
  }

  // The content is a JSON string -> turn it into a real object.
  const parsed = JSON.parse(content);

  // The model returns this when there's no food in the photo.
  if (parsed.error) {
    throw new Error(parsed.error);
  }

  return parsed as FoodResult;
}
