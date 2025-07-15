import React from 'react'

const BlueSideBarIntro = () => {
  return (
      <div className="md:w-1/3 bg-blue-600 p-8 text-white">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Diabetes Risk Assessment</h1>
              <p className="mt-2 opacity-90">Complete this form to evaluate your diabetes risk based on comprehensive health metrics</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Comprehensive Analysis</h3>
                  <p className="text-sm opacity-80">18 key health indicators evaluated</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Instant Results</h3>
                  <p className="text-sm opacity-80">Get your risk assessment immediately</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Medical Accuracy</h3>
                  <p className="text-sm opacity-80">Based on clinical research data</p>
                </div>
              </div>
            </div>
          </div>
  )
}

export default BlueSideBarIntro
