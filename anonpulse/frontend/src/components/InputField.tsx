import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  error,
  helperText,
  className = '',
  ...props
}) => {
  const inputId = id || props.name || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      <label htmlFor={inputId} className="text-sm font-medium text-slate-200">
        {label} {props.required && <span className="text-rose-400">*</span>}
      </label>
      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`bg-slate-800 border rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
          error
            ? 'border-rose-500 focus:ring-rose-500'
            : 'border-slate-700 focus:border-emerald-500 focus:ring-emerald-500'
        } ${className}`}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-rose-400 font-medium">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p className="text-xs text-slate-400">{helperText}</p>
      )}
    </div>
  );
};