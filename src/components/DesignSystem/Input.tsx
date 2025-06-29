import { useState } from 'react';
import styles from './Input.module.css';
import IconSearch from '../IconComponents/IconSearch';

type InputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  fullWidth?: boolean;
  onChange?: (value: string) => void;
  errorMessage?: string;
  state?: string;
};

export default function Input({ label, placeholder, value, fullWidth, onChange, errorMessage, state='initial' }: InputProps) {
  const [internalValue, setInternalValue] = useState(value || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div style={{ maxWidth: fullWidth ? '100%' : '20rem' }} className={`${styles['input-container']} flex flex-col text-preset-4 relative`}>
      <label className={`${styles.label} block text-preset-5 text-grey-500 bold`}>{label}</label>
      <div className="relative">
        <input
          type="text"
          value={internalValue}
          onChange={handleChange}
          placeholder={placeholder}
          style={{ outlineColor: state === 'error' ? 'var(--secondary-red)' : 'var(--beige-500)' }}
          className={`${styles.input} w-full border rounded px-5 py-3 pr-8`}
        />
        <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-gray-500 select-none">
          <IconSearch />
        </span>
      </div>
      {errorMessage && <p className="text-red text-preset-4 mt-1">{errorMessage}</p>}
    </div>
  )
}
