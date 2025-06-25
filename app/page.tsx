'use client';

import { useState } from 'react';

export default function Home() {
const [form, setForm] = useState({
  Pregnancies: 0,                   // No pregnancies
  Glucose: 90,                      // Normal fasting glucose (70-99 mg/dL)
  BloodPressure: 75,                 // Normal blood pressure (<80 diastolic)
  SkinThickness: 20,                 // Normal triceps skinfold thickness
  Insulin: 80,                      // Normal fasting insulin (2-25 μU/mL)
  BMI: 22.5,                        // Healthy weight (18.5-24.9)
  DiabetesPedigreeFunction: 0.3,     // Low genetic risk
  Age: 30,                          // Younger adult
  Glucose_BMI_Ratio: 4.0,           // Derived (90/22.5)
  Age_Glucose_Interaction: 1902      // 30 * 90
});


  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Diabetes Risk Assessment</h1>
            <p className="mt-2 text-gray-600">Enter your health metrics to check your diabetes risk</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(form).map(([key, val]) => (
              <div key={key} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                </label>
                <input
                  type="number"
                  step={key.includes('BMI') || key.includes('Ratio') || key.includes('Function') ? "0.01" : "1"}
                  name={key}
                  value={val}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-6 py-3 rounded-md text-white font-medium ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition-colors shadow-sm`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : 'Check Risk'}
            </button>
          </div>

          {result && (
            <div className={`mt-8 p-6 rounded-lg ${result.predicted_class === 'Diabetes' ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Assessment Result</h2>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${result.predicted_class === 'Diabetes' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {result.predicted_class}
                </span>
                <span className="text-gray-600">Probability: {result.probability}%</span>
              </div>
              
              {result.predicted_class === 'Diabetes' ? (
                <div className="mt-4 text-red-700">
                  <p className="font-medium">High Risk Detected</p>
                  <p className="text-sm">We recommend consulting with a healthcare professional.</p>
                </div>
              ) : (
                <div className="mt-4 text-green-700">
                  <p className="font-medium">Low Risk Detected</p>
                  <p className="text-sm">Maintain healthy habits to keep your risk low.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}