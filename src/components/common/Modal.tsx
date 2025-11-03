import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md mx-auto text-center transform transition-all animate-jump-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-sky-600 dark:text-sky-400">{title}</h2>
        <div className="text-slate-600 dark:text-slate-300">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
