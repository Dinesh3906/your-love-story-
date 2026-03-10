import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StartScreen from './screens/StartScreen';
import GameScreen from './screens/GameScreen';
import EndingScreen from './screens/EndingScreen';
import { BackgroundMusic } from './components/BackgroundMusic';
import { MusicControls } from './components/MusicControls';
import { AchievementOverlay } from './components/AchievementOverlay';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, BannerAdPluginEvents, AdMobBannerSize } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// Ad Unit IDs
const BANNER_AD_ID = "ca-app-pub-5173875521561209/7532909301";

function App() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'ending'>('start');

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      initializeAdMob();
    }
  }, []);

  const initializeAdMob = async () => {
    try {
      await AdMob.initialize({
        testingDevices: [],
      });

      // Show Banner
      await showBanner();

      console.log("AdMob Initialized Successfully (Global)");
    } catch (e) {
      console.error("AdMob Init Error:", e);
    }
  };

  const showBanner = async () => {
    const options: BannerAdOptions = {
      adId: BANNER_AD_ID,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: false
    };
    await AdMob.showBanner(options);
  };

  const handleStartGame = () => {
    setGameState('playing');
  };

  const handleGameOver = () => setGameState('ending');
  const handleRestart = () => setGameState('start');

  return (
    <div className='h-screen w-screen bg-cinematic-gradient flex justify-center items-center overflow-hidden relative'>
      <BackgroundMusic />
      {/* Noise Texture for Depth */}
      <div className='noise-overlay'></div>

      {/* Cinematic Vignette Background */}
      <div className='absolute inset-0 bg-radial-vignette z-10 opacity-70 pointer-events-none'></div>

      {/* Persistent Background Tree Animation */}
      <motion.div
        animate={{
          scale: [1.1, 1.25, 1.15, 1.3, 1.2, 1.1],
          x: [0, -40, 30, -50, 20, 0],
          y: [0, 20, -15, 25, -10, 0],
          rotate: [0, 1.2, -0.8, 1.5, -0.5, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 z-0 opacity-50 pointer-events-none"
      >
        <div
          className="w-full h-full bg-no-repeat bg-cover bg-left lg:bg-center"
          style={{ backgroundImage: 'url("/cherry_tree.png")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/60 to-midnight"></div>
      </motion.div>

      <div className='relative w-full h-full z-20 overflow-hidden'>
        {gameState === 'start' && <StartScreen onStart={handleStartGame} />}
        {gameState === 'playing' && <GameScreen onGameOver={handleGameOver} />}
        {gameState === 'ending' && <EndingScreen onRestart={handleRestart} />}
      </div>
      <AchievementOverlay />
      <MusicControls />
    </div>
  );
}


export default App;
