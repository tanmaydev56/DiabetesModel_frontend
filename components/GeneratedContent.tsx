'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

type Props = {
  type: 'diet' | 'report';
  form: Record<string, any>;
};

export default function GeneratedContent({ type, form }: Props) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const body =
          type === 'diet'
            ? { healthData: form }
            : { healthData: form, assessmentResult: form.assessmentResult || {} };

        const res = await fetch(`/api/${type}-plan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error('Failed to fetch content');
        const data = await res.json();
        console.log('Response:', data);
        setContent(data[type === 'diet' ? 'dietPlan' : 'report']);
      } catch (error) {
        console.error('Error fetching content:', error);
        setContent('An error occurred while fetching the content.');
      } finally {
        setIsLoading(false);
      }
    };

    if (form) {
      fetchContent();
    }
  }, [type, form]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="text-lg font-medium text-gray-700">
            Generating your {type === 'diet' ? 'personalized diet plan' : 'comprehensive report'}...
          </p>
          <p className="text-sm text-gray-500">This may take a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Assessment
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {type === 'diet'
                ? 'Personalized Diabetes Prevention Diet Plan'
                : 'Comprehensive Diabetes Risk Report'}
            </h1>
            <p className="text-blue-100 mt-1">
              {type === 'diet'
                ? 'Tailored nutrition recommendations based on your health profile'
                : 'Detailed analysis of your diabetes risk factors'}
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="prose max-w-none prose-blue prose-lg">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Generated on {new Date().toLocaleDateString()}
              </p>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print or Save
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2">Consult a Professional</h3>
              <p className="text-sm text-gray-600">
                Consider discussing these recommendations with your healthcare provider for personalized advice.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h3 className="font-medium text-green-800 mb-2">Track Your Progress</h3>
              <p className="text-sm text-gray-600">
                Regular monitoring can help you stay on track and make adjustments as needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}