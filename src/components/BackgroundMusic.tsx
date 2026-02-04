import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { getMusicSrc, getMoodFromScene } from '../lib/engines/MusicEngine';

// Re-export for GameScreen debug HUD
export { getMoodFromScene };

export const BackgroundMusic = () => {
    const audioRef1 = useRef<HTMLAudioElement | null>(null);
    const audioRef2 = useRef<HTMLAudioElement | null>(null);
    const activePlayer = useRef<1 | 2>(1);
    const currentSrcRef = useRef<string>('');

    const isMusicPlaying = useGameStore(state => state.isMusicPlaying);
    const currentSceneId = useGameStore(state => state.currentSceneId);
    const scenes = useGameStore(state => state.scenes);

    const currentScene = scenes.find(s => s.id === currentSceneId);
    const musicSrc = getMusicSrc(currentScene);

    // Crossfade duration in milliseconds
    const CROSSFADE_DURATION = 2000;

    useEffect(() => {
        const handleInteraction = () => {
            const currentAudio = activePlayer.current === 1 ? audioRef1.current : audioRef2.current;
            if (currentAudio && isMusicPlaying && currentAudio.paused) {
                currentAudio.play().catch(() => { });
                window.removeEventListener('click', handleInteraction);
                window.removeEventListener('keydown', handleInteraction);
                window.removeEventListener('mousedown', handleInteraction);
            }
        };

        window.addEventListener('click', handleInteraction);
        window.addEventListener('keydown', handleInteraction);
        window.addEventListener('mousedown', handleInteraction);

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
            window.removeEventListener('mousedown', handleInteraction);
        };
    }, [isMusicPlaying]);

    // Handle music source changes with crossfade
    useEffect(() => {
        if (!musicSrc || musicSrc === currentSrcRef.current) return;

        const currentAudio = activePlayer.current === 1 ? audioRef1.current : audioRef2.current;
        const nextAudio = activePlayer.current === 1 ? audioRef2.current : audioRef1.current;

        if (!nextAudio) return;

        // Set up the next track
        nextAudio.src = musicSrc;
        nextAudio.currentTime = 10; // Start at 10 seconds
        nextAudio.playbackRate = 1.03;
        nextAudio.volume = 0;

        if (isMusicPlaying) {
            nextAudio.play().catch(() => { });

            // Crossfade
            const startTime = Date.now();
            const fadeInterval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / CROSSFADE_DURATION, 1);

                if (nextAudio) nextAudio.volume = progress;
                if (currentAudio) currentAudio.volume = 1 - progress;

                if (progress >= 1) {
                    clearInterval(fadeInterval);
                    if (currentAudio) {
                        currentAudio.pause();
                        currentAudio.volume = 1;
                    }
                    // Switch active player
                    activePlayer.current = activePlayer.current === 1 ? 2 : 1;
                }
            }, 50);
        }

        currentSrcRef.current = musicSrc;
    }, [musicSrc, isMusicPlaying]);

    // Handle play/pause
    useEffect(() => {
        const currentAudio = activePlayer.current === 1 ? audioRef1.current : audioRef2.current;

        if (currentAudio) {
            if (isMusicPlaying) {
                currentAudio.play().catch(() => { });
            } else {
                currentAudio.pause();
            }
        }
    }, [isMusicPlaying]);

    return (
        <>
            <audio
                ref={audioRef1}
                src={musicSrc}
                loop
                preload="auto"
                onLoadedData={(e) => {
                    const audio = e.currentTarget;
                    audio.currentTime = 10;
                    audio.playbackRate = 1.03;
                }}
            />
            <audio
                ref={audioRef2}
                loop
                preload="auto"
            />
        </>
    );
};
