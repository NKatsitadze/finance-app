import { useEffect, useRef, useState, Fragment } from 'react';
import styles from './Select.module.css';
import IconSelected from '../IconComponents/IconSelected';

type Option = {
  label: string;
  value: string;
  icon?: any;
  key: string | number;
};

type SelectProps = {
  label: string;
  labelAside?: boolean;
  options: Option[];
  fullWidth?: boolean;
  onChange: (value: string) => void;
};

export default function Select({ label, labelAside, options, fullWidth, onChange }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    setSelected(option);
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div
      ref={wrapperRef}
      className={`${styles.wrapper} text-preset-4 ${labelAside ? 'flex items-center gap-2' : ''}`}
      style={{ maxWidth: fullWidth ? '100%' : '20rem' }}
    >
      <span className={`${!labelAside ? styles.label : ''} text-nowrap block text-preset-5 text-grey-500 bold`}>{label}</span>
      
      {/* relative wrapper for select box and dropdown */}
      <div className="relative w-[100%]">
        <div
          className={`${styles['select-clean']} pointer spacing-4`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2 select-none text-nowrap">
            {selected?.icon}
            <span>{selected?.label || 'Select an option'}</span>
          </div>
          <svg
            className="w-4 h-4 transform transition-transform duration-200"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {isOpen && (
          <div
            className={`${styles.options} max-h-[300px] overflow-y-auto select-none absolute z-10 mt-4 bg-white border border-gray-200 rounded-xl p-3 `}
          >
          {options.map((option, i) => (
            <Fragment key={option.key}>
              <div
                onClick={() => handleSelect(option)}
                className={`${styles.option} flex items-center gap-2 cursor-pointer`}
              >
                <div className={`${styles['option-helper']} text-preset-4 spacing-6`}>
                  {option.icon}
                  {option.label}
                </div>
                {selected?.value === option.value && <IconSelected />}
              </div>
              
              {i !== options.length - 1 && (
                <div className="h-px my-3 bg-gray-200 w-full" />
              )}
            </Fragment>
          ))}

          </div>
        )}
      </div>
    </div>
  );
}
