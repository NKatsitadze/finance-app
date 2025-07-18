'use client'

import React from 'react'
import { useState } from 'react'
import styles from './Button.module.css'
import IconCaretRight from '../IconComponents/IconCaretRight'

type ButtonProps = {
  type?: 'primary' | 'secondary' | 'tertiary' | 'destroy';
  label: string;
  onButtonClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({ type = 'primary', label, onButtonClick }) => {
    const [iconColor, setIconColor] = useState('var(--grey-500)')
    const mouseEnterHandler = () => {
        if(type !== 'tertiary') return
        setIconColor('var(--grey-900)')
    }
    const mouseLeaveHandler = () => {
        if(type !== 'tertiary') return
        setIconColor('var(--grey-500)')
    }

  return (
    <button
      className={`${styles[type]} whitespace-nowrap text-preset-4 pointer ${type === 'tertiary' ? 'spacing-6 justify-center items-center' : 'bold'}`}
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
      onTouchStart={mouseEnterHandler}
      onTouchEnd={mouseLeaveHandler}
      onClick={onButtonClick}
    >
      {label}
      {type === 'tertiary' && <IconCaretRight color={iconColor}/>}
    </button>
  )
}

export default Button
