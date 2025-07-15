import React from 'react';
import { Info } from 'lucide-react'; // optional: icon from lucide-react

interface Field {
  name: string;
  description: string;
}

interface Props {
  fieldGroups: {
    title: string;
    fields: Field[];
  }[];
  fieldLabels: { [key: string]: string };
  form: { [key: string]: string | number };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Form = ({ fieldGroups, fieldLabels, form, handleChange }: Props) => {
  return (
    <div className="space-y-6">
      {fieldGroups.map((group, index) => (
        <div key={index} className="space-y-4">
          <h2 className="text-lg  font-semibold text-gray-800 border-b pb-2">
            {group.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {group.fields.map((field) => (
              <div key={field.name} className="space-y-1">
                <div className="flex items-center gap-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {fieldLabels[field.name] || field.name}
                  </label>
                  {/* Tooltip on hover */}
                 <div className="relative group inline-block mt-[6px] ml-2">
  <button
    type="button"
    className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
    aria-label={`Info about ${field.name}`}
  >
    <Info className="w-5 h-5" />
  </button>

  <div className="absolute left-1/2 transform -translate-x-1/2 z-10 hidden group-hover:block bg-gray-900 text-white text-sm rounded-md px-3 py-2 mt-2 w-72 max-w-xs shadow-lg transition-opacity duration-300">
    <div className="relative">
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-900 rotate-45"></div>
      <p className="text-center">{field.description}</p>
    </div>
  </div>
</div>

                </div>

                <input
                  type="number"
                  step={
                    field.name.includes('BMI') ||
                    field.name.includes('Ratio') ||
                    field.name.includes('Function') ||
                    field.name.includes('log')
                      ? '0.01'
                      : '1'
                  }
                  name={field.name}
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  min={field.name.includes('Is_') ? '0' : undefined}
                  max={field.name.includes('Is_') ? '1' : undefined}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Form;
