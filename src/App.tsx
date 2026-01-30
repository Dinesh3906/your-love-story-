import { useState } from 'react';
import StartScreen from './screens/StartScreen';
import GameScreen from './screens/GameScreen';
import EndingScreen from './screens/EndingScreen';
import { useGameStore } from './store/gameStore';

function App() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'ending'>('start');

  const handleStartGame = () => setGameState('playing');
  const handleGameOver = () => setGameState('ending');
  const handleRestart = () => setGameState('start');

  return (
    <div className='h-screen w-screen bg-cinematic-gradient flex justify-center items-center overflow-hidden relative'>
      {/* Noise Texture for Depth */}
      <div className='noise-overlay'></div>

      {/* Cinematic Vignette Background */}
      <div className='absolute inset-0 bg-radial-vignette z-10 opacity-70 pointer-events-none'></div>

      <div className='relative w-full h-full z-20 overflow-hidden'>
        {gameState === 'start' && <StartScreen onStart={handleStartGame} />}
        {gameState === 'playing' && <GameScreen onGameOver={handleGameOver} />}
        {gameState === 'ending' && <EndingScreen onRestart={handleRestart} />}
      </div>
    </div>
  );
}


export default App;