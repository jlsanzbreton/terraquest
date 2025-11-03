import React from 'react';

interface HUDProps {
  score: number;
  current: number;
  total: number;
}

const HUD: React.FC<HUDProps> = ({ score, current, total }) => {
  const progressPercentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full mb-4 p-4 rounded-xl bg-white dark:bg-slate-800 shadow-md">
      <div className="flex justify-between items-center mb-2 font-bold text-slate-600 dark:text-slate-300">
        <span>Puntuación Total: <span className="text-sky-500 dark:text-sky-400">{score}</span></span>
        <span>Pregunta: {current} / {total}</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
        <div
          className="bg-emerald-500 h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default HUD;
