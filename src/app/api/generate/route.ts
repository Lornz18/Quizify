import { NextResponse } from "next/server";

const key = process.env.GEMINI_KEY;

export async function POST(request: Request) {
  const { text } = await request.json();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;

  // 🔑 Strict JSON format instruction
  const prompt = `You are a quiz generator. 
Based on the following text, create exactly 10 multiple-choice questions.
Each question must include:
- "question": the question string
- "options": an array of 4 possible answers
- "answer": the correct option string

Return ONLY valid JSON in this format (no markdown, no explanation, no numbering):
{
  "questions": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "answer": "B"
    }
  ]
}

Text:
"""${text}"""`;

  const payload = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json", // ✅ force JSON output
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let parsed;
    try {
      parsed = JSON.parse(raw); // ✅ force parse JSON
    } catch (err) {
      throw new Error("Invalid AI response format", err as Error);
    }

    return NextResponse.json({ success: true, questions: parsed.questions });
  } catch (error) {
    console.error("Error in /api/generate:", error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    });
  }
}
