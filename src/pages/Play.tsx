import React from 'react';
import { useGame } from '../contexts/GameContext';
import { Difficulty } from '../types';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import GeoMatch from '../components/GeoMatch';

const Play: React.FC = () => {
  const { gameSettings, setGameSettings } = useGame();
  const [gameStarted, setGameStarted] = React.useState(false);

  const handleDifficultySelect = (difficulty: Difficulty) => {
    setGameSettings({ difficulty, regionId: undefined }); // Reset region when starting from here
    setGameStarted(true);
  };
  
  // If a region was selected from the map, start the game directly
  React.useEffect(() => {
    if (gameSettings.regionId) {
      setGameStarted(true);
    }
  }, [gameSettings.regionId]);

  if (gameStarted) {
    return <GeoMatch />;
  }

  return (
    <Card className="text-center max-w-md">
      <h2 className="text-2xl font-bold mb-4">Elige un Desafío</h2>
      <p className="mb-6 text-slate-500 dark:text-slate-400">Selecciona la dificultad para empezar una ronda de GeoMatch.</p>
      <div className="grid grid-cols-1 gap-4">
        <Button
          onClick={() => handleDifficultySelect(1)}
          className="bg-green-500 hover:bg-green-600 focus:ring-green-300"
        >
          Fácil (1)
        </Button>
        <Button
          onClick={() => handleDifficultySelect(2)}
          className="bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-300"
        >
          Medio (2)
        </Button>
        <Button
          onClick={() => handleDifficultySelect(3)}
          className="bg-red-500 hover:bg-red-600 focus:ring-red-300"
        >
          Difícil (3)
        </Button>
      </div>
    </Card>
  );
};

export default Play;
