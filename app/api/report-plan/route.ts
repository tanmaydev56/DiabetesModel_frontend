import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { healthData, assessmentResult } = await request.json();
    console.log('Received healthData:', healthData);
    console.log('Received assessmentResult:', assessmentResult);
    if (!healthData || !assessmentResult) {
      return NextResponse.json(
        { error: "Missing healthData or assessmentResult" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a health assistant. Based on the following user's health metrics and diabetes assessment result, generate a personalized diabetes risk report and health guidance.

**Assessment Result**: ${assessmentResult}

**Health Metrics**:
\`\`\`json
${JSON.stringify(healthData, null, 2)}
\`\`\`

Include in the report:
- Risk interpretation in layman's terms
- Contributing factors based on the metrics
- Suggested lifestyle and diet changes
- When to seek medical help
- Emotional/mental wellness tips
- Encouraging summary

Format everything in readable **Markdown**.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    return NextResponse.json({ report: text });

  } catch (error: any) {
    console.error("Error generating report:", error);

    // Handle rate limit error gracefully
    if (
      error.message?.includes("Too Many Requests") ||
      error?.status === 429
    ) {
      return NextResponse.json(
        {
          report: ` Your daily limit for generating reports via Gemini API has been exceeded. Please try again tomorrow or consider upgrading your usage limits.`
        },
        { status: 200 }
      );
    }

    // Development fallback
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json({
        report: ` Development fallback report:\n\n- Risk level: Moderate\n- Exercise regularly\n- Eat low-GI foods\n- Stay positive and mindful\n\nThis is a placeholder due to API limits.`
      });
    }

    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
