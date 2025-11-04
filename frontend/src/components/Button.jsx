const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon: Icon = null,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const baseStyles = 'font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 relative overflow-hidden group transform hover:scale-[1.02] active:scale-[0.98]';

  const variants = {
    primary: 'bg-gradient-primary text-white hover:shadow-glow focus:ring-primary-500 shadow-soft hover:shadow-medium',
    secondary: 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 focus:ring-primary-500 shadow-soft hover:shadow-medium',
    accent: 'bg-gradient-accent text-white hover:shadow-glow-accent focus:ring-accent-500 shadow-soft hover:shadow-medium',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500 shadow-soft hover:shadow-medium',
    success: 'bg-gradient-to-r from-success-500 to-success-600 text-white hover:from-success-600 hover:to-success-700 focus:ring-success-500 shadow-soft hover:shadow-medium',
    ghost: 'text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-500 hover:shadow-soft',
    outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 hover:shadow-soft',
  };

  const sizes = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
    xl: 'px-10 py-5 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const renderIcon = () => {
    if (loading) {
      return (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
    }
    
    if (Icon) {
      return <Icon className="h-4 w-4" />;
    }
    
    return null;
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {/* Shimmer effect for primary and accent variants */}
      {(variant === 'primary' || variant === 'accent') && (
        <div className="absolute inset-0 -top-px overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:animate-[shimmer_0.8s_ease-out] pointer-events-none" />
        </div>
      )}
      
      {iconPosition === 'left' && renderIcon()}
      <span className="relative z-10">{children}</span>
      {iconPosition === 'right' && renderIcon()}
    </button>
  );
};

export default Button;

