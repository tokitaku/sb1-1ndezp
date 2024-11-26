import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, ArrowLeft } from 'lucide-react';
import useSound from 'use-sound';
import { Question } from '../types';

interface QuizModeProps {
  questions: Question[];
  onBack: () => void;
}

const QuizMode: React.FC<QuizModeProps> = ({ questions, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [playCorrect] = useSound('/sounds/correct.mp3');
  const [playWrong] = useSound('/sounds/wrong.mp3');
  const [playThinking, { stop: stopThinking }] = useSound('/sounds/thinking.mp3', { loop: true });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      setShowAnswer(true);
      stopThinking();
    }
    return () => clearInterval(interval);
  }, [timer, isTimerRunning, stopThinking]);

  const startTimer = () => {
    setTimer(30);
    setIsTimerRunning(true);
    playThinking();
  };

  const handleAnswer = (correct: boolean) => {
    setIsTimerRunning(false);
    stopThinking();
    if (correct) {
      playCorrect();
      setScore(s => s + 1);
    } else {
      playWrong();
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setShowAnswer(false);
      setIsTimerRunning(false);
      setTimer(30);
    }
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <button onClick={onBack} className="btn-icon">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <Timer className="w-6 h-6" />
            <span className="text-xl font-bold">{timer}s</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">問題 {currentIndex + 1}</h3>
              <p className="text-xl">{currentQuestion.question}</p>
            </div>

            {showAnswer ? (
              <div className="text-center">
                <h4 className="text-xl font-semibold mb-4">答え:</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {currentQuestion.answer}
                </p>
                <button
                  onClick={nextQuestion}
                  className="btn-primary mt-8"
                >
                  次の問題へ
                </button>
              </div>
            ) : (
              <div className="text-center">
                {!isTimerRunning ? (
                  <button
                    onClick={startTimer}
                    className="btn-primary"
                  >
                    タイマースタート
                  </button>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        handleAnswer(true);
                        setShowAnswer(true);
                      }}
                      className="btn-primary bg-green-600 hover:bg-green-700 w-full"
                    >
                      正解
                    </button>
                    <button
                      onClick={() => {
                        handleAnswer(false);
                        setShowAnswer(true);
                      }}
                      className="btn-primary bg-red-600 hover:bg-red-700 w-full"
                    >
                      不正解
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 pt-8 border-t">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">スコア: {score}</span>
            <span className="text-lg">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizMode;