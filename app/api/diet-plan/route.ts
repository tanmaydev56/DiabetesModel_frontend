import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
   const body = await req.json();
    console.log('Received healthData:', body);

    if (!body) {
      return NextResponse.json(
        { error: "Missing healthData in request body" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Create a detailed 4-week diabetes prevention diet plan based on these health metrics:
${JSON.stringify(body, null, 2)}

Include:
1. Daily meal plans (breakfast, lunch, dinner, snacks)
2. Recommended portion sizes
3. Foods to avoid
4. Lifestyle recommendations
5. Weekly goals
6. Hydration advice

Format the response in clear markdown with sections.
Also print the health metrics in a table format (what you received from the user).
Use headings, bullet points, and tables for clarity.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    return NextResponse.json({ dietPlan: text });

  } catch (error: any) {
    console.error("Error generating diet plan:", error);

    // Handle quota exceeded specifically
    if (
      error.message?.includes("Too Many Requests") ||
      error?.status === 429
    ) {
      return NextResponse.json(
        {
          dietPlan: ` You have exceeded the daily limit for generating diet plans using the Gemini API. Please try again tomorrow or upgrade your plan.`,
        },
        { status: 200 } // Send fallback with 200 so frontend can handle it
      );
    }

    // Optional: Add fallback for development
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json({
        dietPlan: ` Development mode fallback diet plan: \n\n- Eat more greens\n- Reduce sugar\n- Stay hydrated\n- Daily walk\n- Avoid processed foods`
      });
    }

    return NextResponse.json(
      { error: "Failed to generate diet plan" },
      { status: 500 }
    );
  }
}
