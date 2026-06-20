import styles from './Select.module.css';

interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string = string> {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  disabled?: boolean;
}

export function Select<T extends string = string>({
  options,
  value,
  onChange,
  className = '',
  disabled,
}: SelectProps<T>) {
  return (
    <select
      className={[styles.select, className].filter(Boolean).join(' ')}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      disabled={disabled}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
