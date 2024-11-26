import React from 'react';
import GameBoard from './components/GameBoard';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <GameBoard />
    </div>
  );
}

export default App;