import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dice6, Users, Gamepad2 } from 'lucide-react';
import useSound from 'use-sound';
import Attack25 from './Attack25';
import QuizMode from './QuizMode';
import { Question } from '../types';
import { parseCSV } from '../utils/csvParser';

const GameBoard: React.FC = () => {
  const [gameMode, setGameMode] = useState<'menu' | 'quiz' | 'attack25'>('menu');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string>('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError('');
    
    if (file) {
      try {
        const parsedQuestions = await parseCSV(file);
        if (parsedQuestions.length === 0) {
          setError('問題が見つかりませんでした。CSVファイルを確認してください。');
          return;
        }
        setQuestions(parsedQuestions);
        setGameMode('quiz');
      } catch (error) {
        console.error('Error parsing CSV:', error);
        setError('CSVファイルの読み込みに失敗しました。');
      }
    }
  };

  if (gameMode === 'attack25') {
    return <Attack25 onBack={() => setGameMode('menu')} />;
  }

  if (gameMode === 'quiz' && questions.length > 0) {
    return <QuizMode questions={questions} onBack={() => setGameMode('menu')} />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-4xl mx-auto p-6"
    >
      <div className="bg-white rounded-xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">クイズマスター</h2>
          <div className="flex gap-4">
            <button className="btn-icon">
              <Dice6 className="w-6 h-6" />
            </button>
            <button className="btn-icon">
              <Users className="w-6 h-6" />
            </button>
            <button className="btn-icon">
              <Gamepad2 className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              className={`game-mode-card ${questions.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileHover={{ scale: questions.length > 0 ? 1.02 : 1 }}
              whileTap={{ scale: questions.length > 0 ? 0.98 : 1 }}
              onClick={() => questions.length > 0 && setGameMode('quiz')}
            >
              <h3 className="text-xl font-semibold mb-2">クイズモード</h3>
              <p className="text-gray-600">基本的なクイズモード</p>
              {questions.length > 0 && (
                <p className="text-sm text-green-600 mt-2">
                  {questions.length}問の問題が読み込まれています
                </p>
              )}
            </motion.div>
            <motion.div 
              className="game-mode-card"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setGameMode('attack25')}
            >
              <h3 className="text-xl font-semibold mb-2">アタック25</h3>
              <p className="text-gray-600">パネルを取り合うクイズバトル</p>
            </motion.div>
          </div>

          <div className="mt-8">
            <input
              type="file"
              accept=".csv"
              className="hidden"
              id="csvUpload"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="csvUpload"
              className="btn-primary block w-full text-center cursor-pointer"
            >
              問題をアップロード (CSV)
            </label>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
            <p className="text-sm text-gray-600 mt-2">
              CSVファイルの形式: no, quiz, answer
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameBoard;