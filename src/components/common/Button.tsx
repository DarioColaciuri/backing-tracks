import { type ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'danger' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const cls = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ');
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
