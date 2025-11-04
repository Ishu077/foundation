

const Checkbox = ({
  label,
  checked,
  onChange,
  error,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex items-center h-6">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="h-5 w-5 rounded border border-neutral-300 text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:ring-offset-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          {...props}
        />
      </div>
      <div className="flex-1">
        {label && (
          <label className="text-sm font-medium text-neutral-700 cursor-pointer">
            {label}
          </label>
        )}
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Checkbox;

