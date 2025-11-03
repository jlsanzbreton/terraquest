import React, { useState, useEffect, useMemo } from 'react';
import questionsData from '../data/questions.json';
import flagsData from '../data/flags.json';
import { Question } from '../types';
import { shuffle } from '../utils/shuffle';
import { useGame } from '../contexts/GameContext';
import { db, addPoints, addBadge, logAnswer } from '../store/db';
import { calculateScore, getUnlockedBadges } from '../utils/gameLogic';
import Button from './common/Button';
import Card from './common/Card';
import Modal from './common/Modal';
import HUD from './HUD';

const GeoMatch: React.FC = () => {
  const { setPage, gameSettings, activeSlotId, currentPlayer } = useGame();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roundEnded, setRoundEnded] = useState(false);
  
  const flagMap = flagsData as Record<string, string>;

  useEffect(() => {
    const allQuestions = questionsData as Question[];
    const filteredQuestions = allQuestions.filter(q => {
      const difficultyMatch = q.difficulty === gameSettings.difficulty;
      const regionMatch = gameSettings.regionId ? q.regionId === gameSettings.regionId : true;
      return difficultyMatch && regionMatch;
    });
    
    setQuestions(shuffle(filteredQuestions).slice(0, gameSettings.count));
  }, [gameSettings]);

  const currentQuestion = questions[currentQuestionIndex];
  const shuffledOptions = useMemo(() => {
    return currentQuestion ? shuffle(currentQuestion.options) : [];
  }, [currentQuestion]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return; // Prevent multiple answers

    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.answer;
    setIsCorrect(correct);

    if (activeSlotId) {
      logAnswer(activeSlotId, currentQuestion.id, correct);
      if (correct) {
        const points = calculateScore(currentQuestion.difficulty);
        setScore(prev => prev + points);
        setCorrectCount(prev => prev + 1);
      }
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setRoundEnded(true);
      }
    }, 1500);
  };

  useEffect(() => {
    const handleRoundEnd = async () => {
        if (!roundEnded || !activeSlotId || !currentPlayer) return;

        await addPoints(activeSlotId, score);
        const historyCount = await db.history.where({ saveSlotId: activeSlotId }).count();
        
        const newBadges = getUnlockedBadges(
            correctCount,
            questions.length,
            historyCount === questions.length
        );

        for (const badgeId of newBadges) {
            await addBadge(activeSlotId, badgeId);
        }
        setIsModalOpen(true);
    };

    handleRoundEnd();
  }, [roundEnded, activeSlotId, score, currentPlayer, questions.length, correctCount]);


  if (questions.length === 0) {
    return (
      <Card className="text-center">
        <p className="text-lg mb-4">¡Oh, no! No encontramos preguntas con esos filtros.</p>
        <div className="flex flex-col gap-2">
            <Button onClick={() => setPage('play')} className="w-full">Cambiar Dificultad</Button>
            <Button onClick={() => setPage('explore')} variant="secondary" className="w-full">Volver al Mapa</Button>
        </div>
      </Card>
    );
  }

  if (!currentQuestion) return null;

  const getButtonClass = (option: string) => {
    if (selectedAnswer === null) {
      return 'bg-slate-200 dark:bg-slate-700 hover:bg-sky-200 dark:hover:bg-sky-800';
    }
    if (option === currentQuestion.answer) {
      return 'bg-emerald-500 text-white animate-pulse-fast';
    }
    if (option === selectedAnswer && !isCorrect) {
      return 'bg-red-500 text-white';
    }
    return 'bg-slate-200 dark:bg-slate-600 opacity-60';
  };

  const renderOptionContent = (option: string) => {
    if(currentQuestion.type === 'GEO_BANDERA') {
      return <span className="text-5xl">{flagMap[option] || option}</span>;
    }
    return option;
  }

  return (
    <div className="w-full max-w-2xl">
      <HUD
        current={currentQuestionIndex + 1}
        total={questions.length}
        score={score + (currentPlayer?.points ?? 0)}
      />
      <Card>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-2 font-semibold">{currentQuestion.category}</p>
        <h3 className="text-xl md:text-2xl text-center font-bold mb-6 min-h-[6rem] flex items-center justify-center">
          {currentQuestion.prompt}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shuffledOptions.map(option => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`p-4 rounded-lg text-lg font-bold transition-all duration-300 ${getButtonClass(option)}`}
            >
              {renderOptionContent(option)}
            </button>
          ))}
        </div>
         {selectedAnswer && (
          <div className="mt-6 text-center p-3 rounded-lg bg-amber-100 dark:bg-amber-900 border-l-4 border-amber-400">
            <p className="font-bold">{isCorrect ? '¡Correcto!' : '¡Casi!'}</p>
            {currentQuestion.extra && <p className="text-sm mt-1">{currentQuestion.extra}</p>}
          </div>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setPage('home')} title="¡Ronda Terminada!">
        <div className="flex flex-col items-center gap-4">
          <p className="text-xl">
            Puntuación de la ronda: <span className="font-bold text-emerald-500">{score} puntos</span>
          </p>
           <p className="text-2xl font-bold">
            {correctCount} / {questions.length} correctas
          </p>
          <div className="text-5xl my-2">
            {correctCount === questions.length ? '🏆' : (correctCount > 0 ? '👍' : '🤔')}
          </div>
          <p>¡Sigue explorando para aprender más!</p>
          <Button onClick={() => setPage('play')} className="w-full">Jugar de Nuevo</Button>
          <Button onClick={() => setPage('home')} variant="secondary" className="w-full">
            Menú Principal
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default GeoMatch;
