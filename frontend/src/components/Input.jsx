import { useState } from 'react';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  success,
  required = false,
  disabled = false,
  icon: Icon = null,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPasswordType = type === 'password';
  const inputType = isPasswordType && showPassword ? 'text' : type;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative group">
        {/* Left Icon */}
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <Icon className={`h-5 w-5 transition-colors duration-200 ${
              isFocused ? 'text-primary-500' : 'text-neutral-400'
            }`} />
          </div>
        )}

        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`w-full px-4 py-3.5 bg-white border rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 transition-all duration-300 disabled:bg-neutral-50 disabled:cursor-not-allowed ${
            Icon && iconPosition === 'left' ? 'pl-11' : ''
          } ${
            isPasswordType ? 'pr-11' : Icon && iconPosition === 'right' ? 'pr-11' : ''
          } ${
            error 
              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
              : success
              ? 'border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
              : isFocused
              ? 'border-primary-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
              : 'border-neutral-200 hover:border-neutral-300'
          } ${className}`}
          {...props}
        />

        {/* Right side icons */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {success && !error && (
            <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
          
          {Icon && iconPosition === 'right' && !isPasswordType && (
            <Icon className={`h-5 w-5 transition-colors duration-200 ${
              isFocused ? 'text-primary-500' : 'text-neutral-400'
            }`} />
          )}
          
          {isPasswordType && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-neutral-400 hover:text-neutral-600 transition-colors duration-200 p-1 rounded-md hover:bg-neutral-100"
            >
              {showPassword ? (
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zM10 3c-4.478 0-8.268 2.943-9.542 7 1.274 4.057 5.064 7 9.542 7 1.375 0 2.725-.186 4.01-.54l-2.589-2.589A3 3 0 0010 9a3 3 0 00-3 3l-2.589-2.589A4 4 0 0110 3z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Error/Success message */}
      {(error || success) && (
        <div className="flex items-center gap-2 mt-2">
          {error && (
            <>
              <svg className="h-4 w-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-600">{error}</p>
            </>
          )}
          {success && !error && (
            <>
              <svg className="h-4 w-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-green-600">{success}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Input;

