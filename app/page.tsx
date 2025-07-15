'use client';

import BlueSideBarIntro from '@/components/BlueSideBarIntro';
import Form from '@/components/Form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const [form, setForm] = useState({
  Pregnancies: 5,                      // Multiple pregnancies increase risk
  Glucose: 180,                        // High fasting glucose (diabetes threshold >126 mg/dL)
  BloodPressure: 90,                   // Elevated blood pressure
  SkinThickness: 40,                   // Higher subcutaneous fat
  Insulin: 200,                        // High insulin level (insulin resistance)
  BMI: 35.2,                           // Obese (BMI ≥30)
  DiabetesPedigreeFunction: 1.2,       // Strong family history
  Age: 55,                             // Older age increases risk
  Glucose_BMI_Ratio: 5.11,             // 180/35.2
  Age_Glucose_Int: 9900,               // 55 * 180
  Insulin_BMI_Ratio: 5.68,             // 200/35.2
  Age_BMI_Int: 1936,                   // 55 * 35.2
  Is_Obese: 1,                         // BMI >30
  Is_Young: 0,                         // Not young
  Glucose2: 32400,                     // 180^2
  BMI2: 1239.04,                       // 35.2^2
  Pregnancies_log1p: 1.7918,           // ln(5+1)
  Insulin_log1p: 5.3033                // ln(200+1)
});

const router = useRouter();

  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatingContent, setGeneratingContent] = useState<'diet' | 'report' | null>(null);
  const [generatedContent, setGeneratedContent] = useState<{
    dietPlan?: string;
    report?: string;
  }>({});


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name.includes('Is_') ? parseInt(value) : parseFloat(value)
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
const generateDietPlan = async () => {
  setGeneratingContent('diet');
  try {
    const res = await fetch('/api/diet-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const { dietPlan } = await res.json();
    setGeneratedContent(dietPlan);

    // Convert form to URLSearchParams
    const query = new URLSearchParams(
      Object.entries(form).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    router.push(`/diet-plan-page?${query}`);
  } catch (error) {
    console.error('Generation error:', error);
  } finally {
    setGeneratingContent(null);
  }
};


const generateFullReport = async () => {
  setGeneratingContent('report');
  try {
    const res = await fetch('/api/report-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ form, result }),
    });

    const { report } = await res.json();
    setGeneratedContent(prev => ({ ...prev, report }));

    // Convert form to query string
    const query = new URLSearchParams(
      Object.entries({
        ...form,
        assessmentResult: JSON.stringify(result), // <- stringify result here
      }).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    router.push(`/report?${query}`);
  } catch (error) {
    console.error('Generation error:', error);
  } finally {
    setGeneratingContent(null);
  }
};






  // Human-friendly labels for form fields
  const fieldLabels: Record<string, string> = {
    Pregnancies: 'Number of Pregnancies',
    Glucose: 'Glucose Level (mg/dL)',
    BloodPressure: 'Blood Pressure (mmHg)',
    SkinThickness: 'Skin Thickness (mm)',
    Insulin: 'Insulin Level (μU/mL)',
    BMI: 'Body Mass Index',
    DiabetesPedigreeFunction: 'Diabetes Pedigree Function',
    Age: 'Age (years)',
    Glucose_BMI_Ratio: 'Glucose/BMI Ratio',
    Age_Glucose_Int: 'Age × Glucose Interaction',
    Insulin_BMI_Ratio: 'Insulin/BMI Ratio',
    Age_BMI_Int: 'Age × BMI Interaction',
    Is_Obese: 'Is Obese (0=No, 1=Yes)',
    Is_Young: 'Is Young (0=No, 1=Yes)',
    Glucose2: 'Glucose Squared',
    BMI2: 'BMI Squared',
    Pregnancies_log1p: 'Log(Pregnancies + 1)',
    Insulin_log1p: 'Log(Insulin + 1)'
  };

  // Group fields into categories for better organization
const fieldGroups = [
  {
    title: 'Basic Health Metrics',
    fields: [
      { name: 'Pregnancies', description: 'Number of times the patient has been pregnant' },
      { name: 'Glucose', description: 'Plasma glucose concentration a 2 hours in an oral glucose tolerance test' },
      { name: 'BloodPressure', description: 'Diastolic blood pressure (mm Hg)' },
      { name: 'SkinThickness', description: 'Triceps skin fold thickness (mm)' },
      { name: 'Insulin', description: '2-Hour serum insulin (mu U/ml)' },
      { name: 'BMI', description: 'Body Mass Index (weight in kg / (height in m)^2)' },
      { name: 'Age', description: 'Age of the patient in years' }
    ]
  },
  {
    title: 'Calculated Metrics',
    fields: [
      { name: 'Glucose_BMI_Ratio', description: 'Ratio of glucose level to BMI; helps identify abnormal combinations' },
      { name: 'Age_Glucose_Int', description: 'Interaction term between age and glucose; may indicate risk escalation with age' },
      { name: 'Insulin_BMI_Ratio', description: 'Ratio of insulin level to BMI; relates body mass with insulin levels' },
      { name: 'Age_BMI_Int', description: 'Interaction between age and BMI; potential indicator of age-related obesity' },
      { name: 'Glucose2', description: 'Square of glucose; used to model non-linear glucose effects' },
      { name: 'BMI2', description: 'Square of BMI; captures non-linear BMI-related health impact' }
    ]
  },
  {
    title: 'Derived Indicators',
    fields: [
      { name: 'DiabetesPedigreeFunction', description: 'Likelihood of diabetes based on family history' },
      { name: 'Is_Obese', description: 'Boolean indicating if BMI exceeds obesity threshold (e.g., BMI > 30)' },
      { name: 'Is_Young', description: 'Boolean flag if the person is considered young (e.g., Age < 25)' },
      { name: 'Pregnancies_log1p', description: 'Log-transformed pregnancies count for normalization (log(1 + x))' },
      { name: 'Insulin_log1p', description: 'Log-transformed insulin for skew correction (log(1 + x))' }
    ]
  }
];


  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
        <BlueSideBarIntro/>

          <div className="md:w-2/3 p-8">
          <Form fieldGroups={fieldGroups} fieldLabels={fieldLabels} form={form} handleChange={handleChange}   />

            <div className="mt-8 text-center">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`px-8 py-3 rounded-lg text-white font-medium ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition-colors shadow-md flex items-center justify-center mx-auto`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Check My Risk
                  </>
                )}
              </button>
            </div>

            {result && (
        <div className={`mt-8 p-6 rounded-lg border ${result.predicted_class === 'Diabetes' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
         <div className={`mt-8 p-6 rounded-lg border ${result.predicted_class === 'Diabetes' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} transition-all duration-300`}>
                <div className="flex items-start">
                  <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${result.predicted_class === 'Diabetes' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-semibold text-gray-800">Assessment Result</h2>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${result.predicted_class === 'Diabetes' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {result.predicted_class}
                      </span>
                      <span className="text-gray-600">Probability: {result.probability}%</span>
                      <span className="text-gray-600">Risk Level: {result.risk_level}</span>
                    </div>
                    
                    <div className={`mt-4 ${result.predicted_class === 'Diabetes' ? 'text-red-700' : 'text-green-700'}`}>
                      <p className="font-medium">
                        {result.predicted_class === 'Diabetes' ? 'High Risk Detected' : 'Low Risk Detected'}
                      </p>
                      <p className="text-sm mt-1">
                        {result.predicted_class === 'Diabetes' 
                          ? 'We strongly recommend consulting with a healthcare professional for further evaluation and guidance.' 
                          : 'Maintain your healthy habits to keep your diabetes risk low. Regular check-ups are still recommended.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <button
              onClick={generateDietPlan}
              disabled={!!generatingContent}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
            >
              {generatingContent === 'diet' ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Get Diet Plan
                </>
              )}
            </button>

            <button
              onClick={generateFullReport}
              disabled={!!generatingContent}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              {generatingContent === 'report' ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Full Report
                </>
              )}
            </button>
          </div>
        </div>
      )}
          </div>
        </div>
      </div>

      
    </main>
  );
}