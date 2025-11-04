
const Card = ({
  children,
  className = '',
  variant = 'default',
  hoverable = false,
  gradient = false,
  glass = false,
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-300 relative overflow-hidden';

  const variants = {
    default: 'bg-white border border-neutral-200/60 hover:border-neutral-300/80 shadow-soft hover:shadow-medium',
    elevated: 'bg-white border border-neutral-200/60 shadow-medium hover:shadow-large hover:-translate-y-1',
    outlined: 'bg-white border-2 border-neutral-300 hover:border-primary-300 hover:shadow-soft',
    ghost: 'bg-neutral-50/50 border border-neutral-200/40 hover:bg-white hover:shadow-soft',
    gradient: 'bg-gradient-to-br from-white to-neutral-50 border border-neutral-200/60 shadow-soft hover:shadow-medium',
  };

  const glassStyles = glass ? 'glass backdrop-blur-xl' : '';
  const gradientOverlay = gradient ? 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary-500/5 before:to-accent-500/5 before:pointer-events-none' : '';
  const hoverClass = hoverable ? 'cursor-pointer hover-lift group' : '';

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${glassStyles} ${gradientOverlay} ${hoverClass} ${className}`}
      {...props}
    >
      {/* Subtle border gradient for elevated cards */}
      {variant === 'elevated' && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Card;


