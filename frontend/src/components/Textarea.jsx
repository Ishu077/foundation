import React from 'react';

const Textarea = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  rows = 6,
  maxLength,
  showCharCount = true,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-xs font-medium uppercase tracking-wide text-neutral-500">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={`w-full px-4 py-3 bg-white border border-neutral-200 rounded-md text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all duration-200 disabled:bg-neutral-50 disabled:cursor-not-allowed resize-none ${
            error ? 'border-red-500 focus:ring-red-600' : ''
          } ${className}`}
          {...props}
        />
      </div>
      <div className="flex items-center justify-between mt-2">
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 16.586l-6.687-6.687a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l8-8z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {showCharCount && maxLength && (
          <p className="text-xs text-gray-500 ml-auto">
            {value.length} / {maxLength}
          </p>
        )}
      </div>
    </div>
  );
};

export default Textarea;

