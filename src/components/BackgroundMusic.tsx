import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export const BackgroundMusic = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { isMusicPlaying } = useGameStore();

    useEffect(() => {
        const handleInteraction = () => {
            if (audioRef.current && isMusicPlaying && audioRef.current.paused) {
                audioRef.current.play().catch(() => { });
                // Remove listener after first successful interaction-triggered play attempt
                window.removeEventListener('click', handleInteraction);
                window.removeEventListener('keydown', handleInteraction);
                window.removeEventListener('mousedown', handleInteraction);
            }
        };

        window.addEventListener('click', handleInteraction);
        window.addEventListener('keydown', handleInteraction);
        window.addEventListener('mousedown', handleInteraction);

        if (audioRef.current) {
            if (isMusicPlaying) {
                audioRef.current.play().catch(() => {
                    console.log("Autoplay blocked. Music will start on next interaction.");
                });
            } else {
                audioRef.current.pause();
            }
        }

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
            window.removeEventListener('mousedown', handleInteraction);
        };
    }, [isMusicPlaying]);

    return (
        <audio
            ref={audioRef}
            src="/sparkle.mp3"
            loop
            autoPlay
            preload="auto"
        />
    );
};
