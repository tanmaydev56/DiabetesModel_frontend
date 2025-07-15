import GeneratedContent from "@/components/GeneratedContent";

export default async function Page({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const searchParams = await searchParamsPromise;

  const {
    assessmentResult,
    ...formParams
  } = searchParams;

  // Safely parse numeric form values
  const safeNumber = (v?: string) => (v !== undefined ? Number(v) : 0);

  const form = {
    Pregnancies: safeNumber(formParams.Pregnancies),
    Glucose: safeNumber(formParams.Glucose),
    BloodPressure: safeNumber(formParams.BloodPressure),
    SkinThickness: safeNumber(formParams.SkinThickness),
    Insulin: safeNumber(formParams.Insulin),
    BMI: safeNumber(formParams.BMI),
    DiabetesPedigreeFunction: safeNumber(formParams.DiabetesPedigreeFunction),
    Age: safeNumber(formParams.Age),
    Glucose_BMI_Ratio: safeNumber(formParams.Glucose_BMI_Ratio),
    Age_Glucose_Int: safeNumber(formParams.Age_Glucose_Int),
    Insulin_BMI_Ratio: safeNumber(formParams.Insulin_BMI_Ratio),
    Age_BMI_Int: safeNumber(formParams.Age_BMI_Int),
    Is_Obese: safeNumber(formParams.Is_Obese),
    Is_Young: safeNumber(formParams.Is_Young),
    Glucose2: safeNumber(formParams.Glucose2),
    BMI2: safeNumber(formParams.BMI2),
    Pregnancies_log1p: safeNumber(formParams.Pregnancies_log1p),
    Insulin_log1p: safeNumber(formParams.Insulin_log1p),
  };

  let result = null;
  try {
    result = assessmentResult ? JSON.parse(assessmentResult) : null;
  } catch (e) {
    console.error("Failed to parse assessmentResult JSON", e);
  }

  return <GeneratedContent type="report" form={form} result={result} />;
}
