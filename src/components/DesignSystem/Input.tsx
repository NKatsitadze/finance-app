import { useState } from 'react';
import styles from './Input.module.css';
import IconSearch from '../IconComponents/IconSearch';

type InputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export default function Input({ label, placeholder, value, onChange }: InputProps) {
  const [internalValue, setInternalValue] = useState(value || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={`${styles['input-container']} text-preset-4 flex flex-col gap-1 text-preset-4 relative`}>
      <label className={`${styles.label} block bold`}>{label}</label>
      <div className="relative">
        <input
          type="text"
          value={internalValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={`${styles.input} w-full border border-gray-300 rounded px-3 py-2 pr-8`}
        />
        <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-gray-500 select-none">
            <IconSearch />
        </span>
      </div>
    </div>
  );
}
