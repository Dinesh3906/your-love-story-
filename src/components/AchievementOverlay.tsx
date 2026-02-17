import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export const AchievementOverlay: React.FC = () => {
    const notifications = useGameStore(state => state.notifications);
    const removeNotification = useGameStore(state => state.removeNotification);

    return (
        <div className="fixed bottom-36 right-4 z-[9999] flex flex-col gap-2 pointer-events-none items-end">
            <AnimatePresence mode="popLayout">
                {notifications.map((notification) => (
                    <motion.div
                        key={notification.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8, x: 50, filter: 'blur(5px)' }}
                        animate={{ opacity: 1, scale: 1, x: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, x: 20, scale: 0.8, filter: 'blur(5px)' }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="pointer-events-auto group cursor-pointer"
                        onClick={() => removeNotification(notification.id)}
                    >
                        <div className="neon-border rounded-full overflow-hidden shadow-xl border border-white/5">
                            <div className="glass-morphism px-3 py-1.5 flex items-center gap-2 min-w-[90px] max-w-[160px]">
                                {/* Minimalist Indicator */}
                                <div className="w-1.5 h-1.5 rounded-full bg-cherry-blossom animate-pulse shadow-[0_0_5px_rgba(255,183,197,0.8)]" />

                                <div className="flex-1 overflow-hidden">
                                    <h3 className="text-[9px] font-sans font-bold text-white truncate text-glow-romantic uppercase tracking-widest">
                                        {notification.title}
                                    </h3>
                                </div>

                                <div className="h-2 w-[1px] bg-white/10" />

                                <span className="text-[7px] font-black text-cherry-blossom/60">
                                    120S
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
