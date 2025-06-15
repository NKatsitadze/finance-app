'use client';

import React from 'react';
import { useState } from 'react';
import styles from './Button.module.css'
import IconCaretRight from '../IconComponents/IconCaretRight';

type ButtonProps = {
  type?: 'primary' | 'secondary' | 'tertiary' | 'destroy';
  label: string;
};

const Button: React.FC<ButtonProps> = ({ type = 'primary', label }) => {
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
      className={`${styles[type]} text-preset-4 pointer ${type === 'tertiary' ? 'spacing-6' : 'bold'}`}
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
      onTouchStart={mouseEnterHandler}
      onTouchEnd={mouseLeaveHandler}
    >
      {label}
      {type === 'tertiary' && <IconCaretRight color={iconColor}/>}
    </button>
  );
};

export default Button;
