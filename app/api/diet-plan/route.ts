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

Role: You are an expert dietitian and certified diabetes educator with 20 years of experience specializing in creating personalized nutrition and lifestyle plans for individuals at high risk for type 2 diabetes. Your approach is evidence-based, empathetic, and highly practical.
Objective: Generate a detailed, actionable, and personalized 4-week diabetes prevention and management plan for a client based on the specific health metrics provided below. The goal is to promote weight loss, improve insulin sensitivity, and normalize blood glucose levels.
Client Health Metrics:
${JSON.stringify(body, null, 2)}
Task Requirements:
Create a comprehensive 4-week plan. The response must be structured logically and include the following distinct sections:
1. Health Metrics Summary:
Present the provided health metrics in a clear, easy-to-read table format.
Briefly interpret the key metrics (Glucose, Insulin, BMI, Blood Pressure) and explain their significance in the context of diabetes risk.
2. Core Dietary Principles:
Outline the foundational principles of the diet plan. Focus on glycemic control, healthy fats, lean proteins, and high fiber intake. Explain the "why" behind these principles in simple terms (e.g., "Fiber helps slow down sugar absorption, preventing sharp spikes in your blood glucose.").
3. Detailed 4-Week Meal Plan:
Provide a day-by-day meal plan for each of the four weeks.
For each day, specify meals for Breakfast, Lunch, Dinner, and two Snacks.
Crucially, include specific and realistic portion sizes for each food item (e.g., "1/2 cup cooked quinoa," "4 ounces grilled chicken breast," "1 medium apple"). Use standard household measurements.
The meal plan should be varied, culturally sensitive (assuming a general Western or adaptable palate, but open to substitutions), and easy to prepare.
4. Foods to Limit or Avoid:
Create a clear, categorized list of foods and beverages to strictly limit or avoid.
Categories should include:
Sugary Foods and Drinks: (e.g., soda, candy, fruit juice).
Refined Carbohydrates: (e.g., white bread, white pasta, pastries).
Unhealthy Fats: (e.g., trans fats in fried foods, processed snacks).
Processed Meats: (e.g., sausages, bacon).
5. Lifestyle and Behavior Recommendations:
Provide actionable advice beyond diet. This section must include:
Physical Activity: A progressive 4-week plan, starting with manageable goals (e.g., "Week 1: 20 minutes of brisk walking, 3 times a week") and increasing in duration or intensity. Include suggestions for both cardiovascular and resistance training.
Stress Management: Techniques like mindfulness, deep breathing exercises, or gentle yoga, explaining their role in managing cortisol and blood sugar.
Sleep Hygiene: The importance of consistent, quality sleep (7-9 hours) and tips for achieving it.
6. Weekly Goals and Monitoring:
Establish a clear, measurable goal for each of the four weeks.
Week 1: Focus on hydration and eliminating sugary drinks.
Week 2: Focus on consistent meal timing and portion control.
Week 3: Focus on meeting physical activity targets.
Week 4: Focus on mindful eating and incorporating stress management techniques.
Include a recommendation to self-monitor key indicators like daily fasting blood glucose (if advised by a doctor) and weekly weight.
7. Hydration Plan:
Specify a daily water intake goal (e.g., "Aim for 8-10 glasses or 2-2.5 liters of water per day").
List beneficial, unsweetened beverage options (e.g., herbal tea, sparkling water with lemon).
Explain why proper hydration is critical for blood sugar regulation and overall health.
Formatting and Tone:
Format: Use clear markdown for structure. Employ headings (##), subheadings (###), bullet points (*), and tables for maximum readability.
Tone: Maintain a professional, encouraging, and supportive tone. The advice should feel empowering, not restrictive. Avoid overly technical jargon. Use LaTeX for any necessary scientific notations, enclosed in '$' or '$$'.
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
