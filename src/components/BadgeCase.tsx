import React from 'react';
import { useGame } from '../contexts/GameContext';
import { ALL_BADGES } from '../utils/gameLogic';
import Card from './common/Card';
import Button from './common/Button';

const BadgeCase: React.FC = () => {
  const { currentPlayer, setPage } = useGame();

  if (!currentPlayer) {
    return (
      <Card className="text-center">
        <p className="text-lg mb-4">Primero debes seleccionar un explorador para ver tus logros.</p>
        <Button onClick={() => setPage('home')}>Volver al inicio</Button>
      </Card>
    );
  }

  const unlockedBadges = currentPlayer.badges || [];

  return (
    <Card>
      <h2 className="text-2xl font-bold text-center mb-6">Vitrina de Logros</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {ALL_BADGES.map(badge => {
          const isUnlocked = unlockedBadges.includes(badge.id);
          return (
            <div
              key={badge.id}
              className={`p-4 border-2 rounded-lg text-center transition-opacity ${
                isUnlocked ? 'border-amber-400 bg-amber-50 dark:bg-slate-700' : 'border-dashed border-slate-300 dark:border-slate-600 opacity-50'
              }`}
            >
              <div className="text-4xl mb-2">{isUnlocked ? badge.icon : '❓'}</div>
              <h3 className="font-bold">{badge.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{badge.description}</p>
            </div>
          );
        })}
      </div>
      <Button variant="secondary" onClick={() => setPage('home')} className="mt-8 w-full">
        Volver al Menú
      </Button>
    </Card>
  );
};

export default BadgeCase;
