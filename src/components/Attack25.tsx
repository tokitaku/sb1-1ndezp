import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users2 } from 'lucide-react';
import useSound from 'use-sound';

interface PanelProps {
  index: number;
  owner: number | null;
  onClick: () => void;
  colors: string[];
}

const Panel: React.FC<PanelProps> = ({ index, owner, onClick, colors }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`aspect-square rounded-lg shadow-md text-2xl font-bold 
    ${owner === null ? 'bg-white' : colors[owner]} 
    transition-colors duration-300`}
    onClick={onClick}
  >
    {index + 1}
  </motion.button>
);

const Attack25: React.FC = () => {
  const [playCorrect] = useSound('/sounds/correct.mp3');
  const [playWrong] = useSound('/sounds/wrong.mp3');
  
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [panels, setPanels] = useState(Array(25).fill(null));
  const [scores, setScores] = useState([0, 0, 0, 0]);
  
  const colors = [
    'bg-blue-500 text-white',
    'bg-red-500 text-white',
    'bg-green-500 text-white',
    'bg-yellow-500 text-white'
  ];

  // 方向ベクトルの定義（上、右上、右、右下、下、左下、左、左上）
  const directions = [
    -5, -4, 1, 6, 5, 4, -1, -6
  ];

  const isValidPosition = (pos: number) => pos >= 0 && pos < 25;

  const checkDirection = (startPos: number, direction: number, player: number): number[] => {
    const sandwiched: number[] = [];
    let currentPos = startPos + direction;
    
    // 盤面の端までチェック
    while (isValidPosition(currentPos)) {
      // 行の境界チェック
      if (
        (direction === 1 && Math.floor(currentPos / 5) !== Math.floor((currentPos - 1) / 5)) ||
        (direction === -1 && Math.floor(currentPos / 5) !== Math.floor((currentPos + 1) / 5))
      ) {
        break;
      }

      const currentOwner = panels[currentPos];
      
      if (currentOwner === null) {
        break;
      }
      
      if (currentOwner === player) {
        return sandwiched;
      }
      
      sandwiched.push(currentPos);
      currentPos += direction;
    }
    
    return [];
  };

  const updatePanels = (position: number, player: number) => {
    const newPanels = [...panels];
    newPanels[position] = player;
    
    let flippedPanels: number[] = [];
    
    // 全方向をチェック
    directions.forEach(direction => {
      const sandwiched = checkDirection(position, direction, player);
      flippedPanels = [...flippedPanels, ...sandwiched];
    });
    
    // 挟まれたパネルの色を変更
    flippedPanels.forEach(pos => {
      newPanels[pos] = player;
    });
    
    setPanels(newPanels);
    
    // スコアの更新
    const newScores = [...scores];
    newScores[player] += 1 + flippedPanels.length;
    setScores(newScores);
    
    return flippedPanels.length > 0;
  };

  const handlePanelClick = (index: number) => {
    if (panels[index] !== null) return;

    // Simulate correct answer for demo
    const correct = Math.random() > 0.3;
    
    if (correct) {
      playCorrect();
      updatePanels(index, currentPlayer);
    } else {
      playWrong();
    }
    
    setCurrentPlayer((prev) => (prev + 1) % 4);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">アタック25</h2>
          <div className="flex items-center gap-4">
            <Users2 className="w-6 h-6" />
            <span className="text-lg font-semibold">
              プレイヤー {currentPlayer + 1} の番
            </span>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-8">
          {panels.map((owner, index) => (
            <Panel
              key={index}
              index={index}
              owner={owner}
              onClick={() => handlePanelClick(index)}
              colors={colors}
            />
          ))}
        </div>

        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <div className="flex gap-8">
            {scores.map((score, index) => (
              <div
                key={index}
                className={`flex flex-col items-center ${
                  currentPlayer === index ? 'scale-110 transform' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full ${colors[index]}`} />
                <span className="font-bold text-lg">{score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attack25;