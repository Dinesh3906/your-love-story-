import { motion } from 'framer-motion';
import { Choice } from '../lib/engines/BranchEngine';

interface Props {
    choices: Choice[];
    onChoiceSelect: (choice: Choice) => void;
}

export default function ChoiceButtons({ choices, onChoiceSelect }: Props) {
    return (
        <div className="w-full flex flex-col gap-3 sm:gap-5">
            {choices.map((choice, index) => (
                <motion.button
                    key={index}
                    initial={{ opacity: 0, x: 60, rotateY: 15 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    transition={{ delay: index * 0.2, duration: 1, type: 'spring' }}
                    whileHover={{ scale: 1.04, x: 20, translateZ: 50, boxShadow: '0 0 50px rgba(255, 183, 197, 0.25)' }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onChoiceSelect(choice)}
                    className="group relative w-full text-left glass-morphism p-3 sm:p-6 lg:p-8 rounded-[20px] sm:rounded-[32px] neon-border overflow-hidden transition-all duration-700"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-cherry-blossom/0 via-cherry-blossom/10 to-cherry-blossom/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1500 ease-in-out" />

                    <div className="flex items-center gap-4 sm:gap-10 relative z-10">
                        <span className="text-cherry-blossom font-serif text-xl sm:text-3xl group-hover:scale-125 group-hover:rotate-45 transition-all duration-700">✧</span>
                        <span className="flex-1 text-white/95 text-base sm:text-lg lg:text-2xl font-serif tracking-wide leading-relaxed font-light italic">
                            {choice.text}
                        </span>
                        <motion.div
                            className="hidden sm:block w-16 h-[1px] bg-white/10 group-hover:bg-cherry-blossom group-hover:w-24 transition-all duration-1000"
                            initial={{ width: 0 }}
                            animate={{ width: 64 }}
                        />
                    </div>
                </motion.button>
            ))}
        </div>
    );
}
