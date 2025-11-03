import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, createOrUpdateSaveSlot } from '../store/db';
import type { Page, SaveSlot, Difficulty } from '../types';

interface GameState {
  currentPage: Page;
  setPage: (page: Page) => void;
  
  activeSlotId: number | null;
  setActiveSlotId: (id: number) => void;
  
  currentPlayer: SaveSlot | null;
  updatePlayerName: (name: string) => Promise<void>;

  gameSettings: {
    difficulty: Difficulty;
    regionId?: string;
    count: number;
  };
  setGameSettings: (settings: Partial<GameState['gameSettings']>) => void;
}

const GameContext = createContext<GameState | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setPage] = useState<Page>('home');
  const [activeSlotId, setActiveSlotId] = useState<number | null>(1); // Default to slot 1
  const [gameSettings, setGameSettingsState] = useState<GameState['gameSettings']>({
    difficulty: 1 as Difficulty,
    count: 5,
  });

  const currentPlayer = useLiveQuery<SaveSlot | null>(
    async () => {
      if (!activeSlotId) {
        return null;
      }
      const player = await db.saves.get(activeSlotId);
      return player ?? null;
    },
    [activeSlotId]
  ) ?? null;

  const updatePlayerName = useCallback(async (name: string) => {
    if (!activeSlotId) return;

    const existingPlayer = await db.saves.get(activeSlotId);

    const newPlayer: SaveSlot = existingPlayer
      ? { ...existingPlayer, playerName: name }
      : {
          id: activeSlotId,
          playerName: name,
          createdAt: Date.now(),
          points: 0,
          badges: [],
          seenTips: [],
        };
    
    await createOrUpdateSaveSlot(newPlayer);
  }, [activeSlotId]);

  const setGameSettings = (settings: Partial<GameState['gameSettings']>) => {
    setGameSettingsState(prev => ({ ...prev, ...settings }));
  };

  const value = {
    currentPage,
    setPage,
    activeSlotId,
    setActiveSlotId,
    currentPlayer,
    updatePlayerName,
    gameSettings,
    setGameSettings,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
