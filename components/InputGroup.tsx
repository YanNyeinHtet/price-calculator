
import React from 'react';
import { Check, Info } from 'lucide-react';

interface InputGroupProps {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const InputGroup: React.FC<InputGroupProps> = ({ label, description, icon, children }) => {
  return (
    <div className="mb-6 p-4 bg-neutral-900/80 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors">
      <div className="flex items-center gap-2 mb-3">
        {icon && <div className="text-yellow-500">{icon}</div>}
        <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider">{label}</h3>
        {description && (
          <div className="group relative">
            <Info size={14} className="text-neutral-500 cursor-help" />
            <div className="absolute left-full top-0 ml-2 w-48 p-2 bg-black text-xs text-neutral-300 rounded shadow-xl border border-neutral-800 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
              {description}
            </div>
          </div>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
};

interface RadioCardProps<T> {
  options: T[];
  value: T;
  onChange: (val: T) => void;
  colorMap?: Record<string, string>;
  labels?: Record<string, string>;
  descriptions?: Record<string, string>;
}

export const RadioCards = <T extends string>({ options, value, onChange, colorMap, labels, descriptions }: RadioCardProps<T>) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {options.map((option) => {
          const isSelected = value === option;
          const colorClass = isSelected 
            ? (colorMap?.[option] || 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]') 
            : 'bg-black border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:border-neutral-700';
          
          return (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`
                relative flex flex-col items-center justify-center py-3 px-2 rounded-lg border transition-all duration-200
                ${colorClass}
              `}
            >
              {isSelected && (
                <div className="absolute top-1 right-1">
                  <Check size={12} className="text-white" />
                </div>
              )}
              <span className="text-xs sm:text-sm font-medium">{labels?.[option] || option}</span>
            </button>
          );
        })}
      </div>
      
      {/* Selected Option Description */}
      {descriptions && descriptions[value] && (
        <div className="relative overflow-hidden rounded-md bg-neutral-950 border border-neutral-800 p-3 animate-in fade-in slide-in-from-top-1 duration-200">
           <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-500 to-red-600"></div>
           <p className="text-xs text-neutral-400 pl-2 leading-relaxed">
             <span className="font-semibold text-neutral-200 block mb-0.5">{labels?.[value] || value}:</span>
             {descriptions[value]}
           </p>
        </div>
      )}
    </div>
  );
};
