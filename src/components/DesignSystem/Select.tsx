import { useEffect, useRef, useState, Fragment } from 'react'
import styles from './Select.module.css'
import IconSelected from '../IconComponents/IconSelected'
import IconFilter from '../IconComponents/IconFilter'
import IconSort from '../IconComponents/IconSort'

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
  selectedValue?: string;
  iconSelector?: boolean;
  type?: string;
  onChange: (value: string) => void;
};

export default function Select({ label, labelAside, options, fullWidth, selectedValue, iconSelector, type, onChange }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<Option | null>(null)
  const [dropdownStyles, setDropdownStyles] = useState<React.CSSProperties>({})
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedValue) {
      const matched = options.find((opt) => opt.value === selectedValue)
      if (matched) setSelected(matched)
    } else {
      setSelected(null)
    }
  }, [])

  const handleSelect = (option: Option) => {
    setSelected(option)
    onChange(option.value)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleOpen = () => {
    const rect = wrapperRef.current?.getBoundingClientRect()
    const DROPDOWN_WIDTH = 240
    const DROPDOWN_HEIGHT = 300

    if (rect) {
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      const spaceRight = window.innerWidth - rect.left
      const spaceLeft = rect.right

      const position: React.CSSProperties = {
        position: 'absolute',
        zIndex: 10,
        maxHeight: DROPDOWN_HEIGHT,
        minWidth: iconSelector ? 200 : '100%',
        overflowY: 'auto',
        backgroundColor: 'white',
        border: '1px solid var(--grey-100)',
        borderRadius: '0.75rem',
        padding: '0.75rem',
        boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.25)',
      }

      // Vertical positioning
      if (spaceBelow >= DROPDOWN_HEIGHT) {
        position.top = '100%'
        position.marginTop = '1rem'
      } else if (spaceAbove >= DROPDOWN_HEIGHT) {
        position.bottom = '100%'
        position.marginBottom = '1rem'
      } else {
        position.top = '100%'
        position.marginTop = '1rem'
        position.maxHeight = Math.max(spaceBelow - 16, 100)
      }

      // Horizontal adjustments
      if (spaceRight < DROPDOWN_WIDTH && spaceLeft > DROPDOWN_WIDTH) {
        position.right = 0
        position.left = 'auto'
      } else {
        position.left = 0
        position.right = 'auto'
      }

      setDropdownStyles(position)
    }

    setIsOpen(!isOpen)
  }

  return (
    <div
      ref={wrapperRef}
      className={`${!iconSelector ? styles.wrapper : undefined} text-preset-4 ${labelAside ? 'flex items-center gap-2' : ''}`}
      style={{ maxWidth: fullWidth ? '100%' : '20rem' }}
    >
      {!iconSelector && <span className={`${!labelAside ? styles.label : ''} text-nowrap block text-preset-5 text-grey-500 bold`}>{label}</span>}
      
      <div className="relative w-[100%]">
        <div
          className={`${styles['select-clean']} pointer spacing-4`}
          style={ iconSelector ? { outline: 'none' } : undefined }
          onClick={handleOpen}
        >
          {iconSelector && type === 'sort' && <IconSort/>}
          {iconSelector && type === 'filter' && <IconFilter/>}

          {!iconSelector && <>
            <div className="flex items-center gap-2 select-none text-nowrap">
              {selected?.icon}
              <span className={`${selected ? 'text-grey-900' : ''}`}>{selected?.label || 'Select an option'}</span>
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
          </>}
        </div>

        {isOpen && (
          <div
            className={`${styles.options} select-none absolute`}
            style={dropdownStyles}
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
  )
}
