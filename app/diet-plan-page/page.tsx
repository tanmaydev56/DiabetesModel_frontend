// app/diet-plan-page/page.tsx
import GeneratedContent from "@/components/GeneratedContent";

export default async function Page({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const searchParams = await searchParamsPromise;

  const safeNumber = (v?: string) => (v !== undefined ? Number(v) : 0);

  const form = {
    Pregnancies: safeNumber(searchParams.Pregnancies),
    Glucose: safeNumber(searchParams.Glucose),
    BloodPressure: safeNumber(searchParams.BloodPressure),
    SkinThickness: safeNumber(searchParams.SkinThickness),
    Insulin: safeNumber(searchParams.Insulin),
    BMI: safeNumber(searchParams.BMI),
    DiabetesPedigreeFunction: safeNumber(searchParams.DiabetesPedigreeFunction),
    Age: safeNumber(searchParams.Age),
    Glucose_BMI_Ratio: safeNumber(searchParams.Glucose_BMI_Ratio),
    Age_Glucose_Int: safeNumber(searchParams.Age_Glucose_Int),
    Insulin_BMI_Ratio: safeNumber(searchParams.Insulin_BMI_Ratio),
    Age_BMI_Int: safeNumber(searchParams.Age_BMI_Int),
    Is_Obese: safeNumber(searchParams.Is_Obese),
    Is_Young: safeNumber(searchParams.Is_Young),
    Glucose2: safeNumber(searchParams.Glucose2),
    BMI2: safeNumber(searchParams.BMI2),
    Pregnancies_log1p: safeNumber(searchParams.Pregnancies_log1p),
    Insulin_log1p: safeNumber(searchParams.Insulin_log1p),
  };

  return <GeneratedContent type="diet" form={form} />;
}
