const Header = ({
  title,
  subtitle,
  icon: Icon = null,
  actions = [],
  gradient = false,
  glass = false,
}) => {
  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      glass 
        ? 'glass backdrop-blur-xl border-b border-white/20' 
        : gradient
        ? 'bg-gradient-to-r from-white via-white to-neutral-50 border-b border-neutral-200/60'
        : 'bg-white/95 backdrop-blur-sm border-b border-neutral-200/60'
    }`}>
      <div className="mx-auto px-6 py-8" style={{ maxWidth: '1200px' }}>
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {Icon && (
              <div className="flex-shrink-0 p-3 bg-gradient-primary rounded-2xl shadow-soft group-hover:shadow-glow transition-all duration-300">
                <Icon className="h-7 w-7 text-white" />
              </div>
            )}
            <div className="space-y-1">
              <h1 className={`text-4xl font-bold tracking-tight ${
                gradient ? 'text-gradient' : 'text-neutral-900'
              }`}>
                {title}
              </h1>
              {subtitle && (
                <p className="text-neutral-600 text-base font-medium">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          {actions.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap justify-end">
              {actions.map((action, idx) => (
                <div key={idx} className="animate-fadeIn" style={{ animationDelay: `${idx * 100}ms` }}>
                  {action}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Decorative gradient line */}
        <div className="mt-6 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent opacity-60" />
      </div>
    </header>
  );
};

export default Header;

