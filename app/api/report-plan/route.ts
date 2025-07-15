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
You are an expert-level AI Health Assistant, specializing in preventive cardiology and endocrinology. Your role is to provide clear, empathetic, and actionable health guidance based on user-provided data.

**Objective**:
Generate a personalized and comprehensive diabetes risk report for the user. The report should be easy to understand for a layperson, identifying key risk factors from their data and providing a holistic plan for risk reduction.

**User's Assessment Result**:
The user has been assessed with a **${assessmentResult}** risk of developing diabetes.

**User's Health Metrics**:
\`\`\`json
${JSON.stringify(healthData, null, 2)}
\`\`\`

**Required Report Structure**:

Please generate the report using the following sections in clear, readable Markdown.

**1. Your Diabetes Risk Explained (Layman's Terms)**
   - Start with a clear statement of the user's risk level (${assessmentResult}).
   - Explain what this risk level means in simple, non-alarming terms (e.g., "This means you have several key indicators that are strongly associated with the future development of type 2 diabetes. The good news is that this provides a powerful opportunity to make positive changes.").

**2. Key Contributing Factors From Your Metrics**
   - Analyze the provided JSON data.
   - For each metric that significantly contributes to the risk (e.g., high Glucose, high BMI, elevated Blood Pressure), create a sub-section.
   - In each sub-section, explain *how* that specific factor (like 'Glucose' or 'BMI') contributes to diabetes risk. For example: "Your glucose level is higher than the optimal range, which suggests your body may be struggling to manage sugar effectively, a condition known as insulin resistance."

**3. Actionable Health Guidance: Your Path Forward**
   - Create two clear sub-sections: "Lifestyle Recommendations" and "Dietary Changes."
   - **Lifestyle Recommendations**: Provide a bulleted list of 3-5 high-impact, achievable habits. Include specifics for physical activity (e.g., "Aim for 150 minutes of moderate-intensity exercise, like brisk walking, per week"), sleep, and stress management.
   - **Dietary Changes**: Provide a bulleted list of 3-5 core dietary principles. Focus on concepts like the "Plate Method" (1/2 non-starchy vegetables, 1/4 lean protein, 1/4 complex carbs), reducing sugary beverages, and increasing fiber. Give concrete food examples.

**4. When to Consult a Healthcare Professional**
   - Provide clear, unambiguous guidance on when to see a doctor.
   - Include points like: "Schedule a consultation with your doctor within the next month to discuss these results and create a formal medical plan." and "Seek immediate medical attention if you experience symptoms like excessive thirst, frequent urination, unexplained weight loss, or blurred vision."

**5. Emotional and Mental Wellness**
   - Acknowledge that this news can be stressful.
   - Provide a short, bulleted list of tips for maintaining mental well-being, such as practicing mindfulness, connecting with a support system (family, friends), and celebrating small victories in your health journey.

**6. Encouraging Summary**
   - Conclude the report with a positive and motivational summary.
   - Reiterate that the user has the power to significantly improve their health outcomes through proactive steps. Emphasize that these changes are a marathon, not a sprint.

**Formatting and Tone**:
- **Format**: Use Markdown extensively. Employ headings, bold text, and bullet points to create a well-structured and scannable report.
- **Tone**: Maintain an encouraging, empathetic, and authoritative tone. The goal is to empower the user, not to scare them.
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
