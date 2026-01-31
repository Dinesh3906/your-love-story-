import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export const MusicControls = () => {
    const { isMusicPlaying, setIsMusicPlaying } = useGameStore();

    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMusicPlaying(!isMusicPlaying)}
            className="fixed bottom-24 right-6 sm:bottom-8 sm:right-8 z-[100] p-4 sm:p-4 rounded-full glass-morphism border border-cherry-blossom/60 text-white shadow-[0_0_30px_rgba(255,183,197,0.4)] hover:shadow-[0_0_40px_rgba(255,183,197,0.6)] transition-all group overflow-hidden"
            title={isMusicPlaying ? "Mute Music" : "Play Music"}
        >
            <div className="relative z-10 flex items-center justify-center">
                {isMusicPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume-2 sm:w-5 sm:h-5"><path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume-x sm:w-5 sm:h-5"><path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" x2="17" y1="9" y2="15" /><line x1="17" x2="23" y1="9" y2="15" /></svg>
                )}
            </div>
            {!isMusicPlaying && (
                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: '24px', opacity: 1 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[1.5px] sm:h-[2px] bg-cherry-blossom rotate-45 pointer-events-none"
                />
            )}
        </motion.button>
    );
};
