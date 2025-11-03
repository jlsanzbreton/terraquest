import React from 'react';
import { GameProvider, useGame } from './contexts/GameContext';
import Home from './pages/Home';
import Play from './pages/Play';
import Explore from './pages/Explore';
import BadgeCase from './components/BadgeCase';

const AppContent: React.FC = () => {
  const { currentPage, currentPlayer } = useGame();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'play':
        return <Play />;
      case 'explore':
        return <Explore />;
      case 'badges':
        return <BadgeCase />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl min-h-screen flex flex-col items-center justify-center">
      <header className="w-full mb-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-sky-600 dark:text-sky-400" style={{ fontFamily: "'Nunito', sans-serif" }}>
          TerraQuest
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400">Exploradores del Mundo</p>
         {currentPlayer && (
          <div className="mt-2 text-sm font-bold bg-white dark:bg-slate-700 p-2 rounded-lg shadow-sm inline-block">
            Jugador: {currentPlayer.playerName} | Puntos: {currentPlayer.points}
          </div>
        )}
      </header>
      <main className="w-full flex-grow flex flex-col items-center justify-center">
        {renderPage()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

export default App;
