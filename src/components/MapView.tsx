import React from 'react';
import WorldMap from '../assets/world-continents.svg?react';
import Card from './common/Card';
import { useGame } from '../contexts/GameContext';
import Button from './common/Button';

const MapView: React.FC = () => {
  const { setPage, setGameSettings } = useGame();

  const handleRegionClick = (regionId: string) => {
    console.log(`Region clicked: ${regionId}`);
    setGameSettings({ regionId });
    setPage('play');
  };

  return (
    <Card className="text-center">
      <h2 className="text-2xl font-bold mb-4">Explora el Mundo</h2>
      <p className="mb-6 text-slate-500 dark:text-slate-400">Haz clic en un continente para empezar a jugar preguntas sobre esa región.</p>
      <div className="w-full overflow-x-auto">
        <WorldMap
          className="w-full h-auto max-w-3xl mx-auto"
          onClick={(event: React.MouseEvent<SVGSVGElement>) => {
            const target = event.target as SVGElement;
            if (target.id && target.classList.contains('continent')) {
              handleRegionClick(target.id);
            }
          }}
          onKeyDown={(event: React.KeyboardEvent<SVGSVGElement>) => {
            if (event.key === 'Enter' || event.key === ' ') {
              const target = event.target as SVGElement;
              if (target.id && target.classList.contains('continent')) {
                handleRegionClick(target.id);
              }
            }
          }}
        />
      </div>
      <Button variant="secondary" onClick={() => setPage('home')} className="mt-6">
        Volver al Menú
      </Button>
    </Card>
  );
};

export default MapView;
