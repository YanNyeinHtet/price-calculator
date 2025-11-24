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
    <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
      <div className="flex items-center gap-2 mb-3">
        {icon && <div className="text-cyan-400">{icon}</div>}
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">{label}</h3>
        {description && (
          <div className="group relative">
            <Info size={14} className="text-slate-500 cursor-help" />
            <div className="absolute left-full top-0 ml-2 w-48 p-2 bg-slate-900 text-xs text-slate-300 rounded shadow-xl border border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
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
}

export const RadioCards = <T extends string>({ options, value, onChange, colorMap, labels }: RadioCardProps<T>) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {options.map((option) => {
        const isSelected = value === option;
        const colorClass = isSelected 
          ? (colorMap?.[option] || 'bg-cyan-600 border-cyan-400 text-white shadow-[0_0_15px_rgba(8,145,178,0.4)]') 
          : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600';
        
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
  );
};