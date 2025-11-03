import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'px-6 py-3 font-bold rounded-lg shadow-md transform transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100';
  
  const variantStyles = {
    primary: 'bg-sky-500 hover:bg-sky-600 text-white focus:ring-sky-300',
    secondary: 'bg-amber-400 hover:bg-amber-500 text-slate-800 focus:ring-amber-200',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-300',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
