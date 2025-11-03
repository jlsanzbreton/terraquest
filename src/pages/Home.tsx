import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../store/db';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Home: React.FC = () => {
  const { setPage, setActiveSlotId, activeSlotId, currentPlayer, updatePlayerName } = useGame();
  const [playerName, setPlayerName] = useState('');
  const allSaves = useLiveQuery(() => db.saves.toArray(), []);

  useEffect(() => {
    if (currentPlayer) {
      setPlayerName(currentPlayer.playerName);
    } else {
      setPlayerName('');
    }
  }, [currentPlayer]);

  const handleSelectSlot = (id: number) => {
    setActiveSlotId(id);
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value);
  }

  const handleNameSave = () => {
    if(playerName.trim()){
      updatePlayerName(playerName.trim());
    }
  }

  return (
    <Card className="max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">¡Bienvenido, explorador!</h2>
      
      <div className="mb-6">
        <p className="font-semibold mb-2">Elige tu partida:</p>
        <div className="flex justify-center gap-2">
          {[1, 2, 3].map(id => {
            const save = allSaves?.find(s => s.id === id);
            return (
              <button
                key={id}
                onClick={() => handleSelectSlot(id)}
                className={`w-24 h-24 rounded-lg flex flex-col justify-center items-center font-bold border-4 transition-all
                  ${activeSlotId === id ? 'border-sky-500 scale-105 bg-sky-100 dark:bg-sky-900' : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 hover:border-sky-400'}`}
              >
                <span>Slot {id}</span>
                <span className="text-xs font-normal truncate w-full px-1">{save ? save.playerName : 'Vacío'}</span>
              </button>
            )
          })}
        </div>
      </div>

      {activeSlotId && (
        <div className="mb-6 animate-fade-in">
          <label htmlFor="playerName" className="font-semibold mb-2 block">
            Nombre del Explorador:
          </label>
          <div className="flex gap-2">
            <input
              id="playerName"
              type="text"
              value={playerName}
              onChange={handleNameChange}
              onBlur={handleNameSave}
              placeholder="Escribe tu nombre..."
              className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-transparent focus:border-sky-500 focus:ring-0"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <Button onClick={() => setPage('play')} disabled={!currentPlayer}>
          Jugar
        </Button>
        <Button onClick={() => setPage('explore')} variant="secondary" disabled={!currentPlayer}>
          Explorar Mapa
        </Button>
        <Button onClick={() => setPage('badges')} className="bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-300" disabled={!currentPlayer}>
          Mi Colección
        </Button>
      </div>
      {!currentPlayer && activeSlotId && <p className="text-sm mt-4 text-red-500">¡Escribe un nombre para empezar a jugar!</p>}
    </Card>
  );
};

export default Home;
