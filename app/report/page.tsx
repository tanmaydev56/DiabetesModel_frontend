import GeneratedContent from "@/components/GeneratedContent";

export default async function Page({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const searchParams = await searchParamsPromise;

  const { assessmentResult, ...restParams } = searchParams;

  const safeNumber = (v?: string) => (v !== undefined ? Number(v) : 0);

  const form = {
    Pregnancies: safeNumber(restParams.Pregnancies),
    Glucose: safeNumber(restParams.Glucose),
    BloodPressure: safeNumber(restParams.BloodPressure),
    SkinThickness: safeNumber(restParams.SkinThickness),
    Insulin: safeNumber(restParams.Insulin),
    BMI: safeNumber(restParams.BMI),
    DiabetesPedigreeFunction: safeNumber(restParams.DiabetesPedigreeFunction),
    Age: safeNumber(restParams.Age),
    Glucose_BMI_Ratio: safeNumber(restParams.Glucose_BMI_Ratio),
    Age_Glucose_Int: safeNumber(restParams.Age_Glucose_Int),
    Insulin_BMI_Ratio: safeNumber(restParams.Insulin_BMI_Ratio),
    Age_BMI_Int: safeNumber(restParams.Age_BMI_Int),
    Is_Obese: safeNumber(restParams.Is_Obese),
    Is_Young: safeNumber(restParams.Is_Young),
    Glucose2: safeNumber(restParams.Glucose2),
    BMI2: safeNumber(restParams.BMI2),
    Pregnancies_log1p: safeNumber(restParams.Pregnancies_log1p),
    Insulin_log1p: safeNumber(restParams.Insulin_log1p),
  };

  return <GeneratedContent type="report" form={form} result={assessmentResult} />;
}
