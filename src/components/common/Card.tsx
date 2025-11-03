import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg w-full ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
