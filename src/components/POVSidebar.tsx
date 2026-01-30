import { motion } from 'framer-motion';
import { Character } from '../store/gameStore';

interface Props {
  characters: Character[];
  currentPOV: string | null;
  onSwitchPOV: (id: string) => void;
}

export default function POVSidebar({ characters, currentPOV, onSwitchPOV }: Props) {
  return (
    <div className='flex flex-col items-center gap-4 glass-panel p-2 rounded-full'>
      {characters.map((char) => {
        // Fix path resolution: images are in /game_chars/ filename
        const imagePath = char.image?.includes('game_chars') ? char.image : `/game_chars/${char.image}`;

        return (
          <motion.button
            key={char.id}
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSwitchPOV(char.id)}
            className={`relative w-14 h-14 rounded-full border-2 overflow-hidden shadow-xl transition-all duration-300 ${currentPOV === char.id
              ? 'border-pink-500 ring-4 ring-pink-200 scale-110 z-10'
              : 'border-white opacity-70 hover:opacity-100'
              }`}
          >
            <img
              src={imagePath || `https://api.dicebear.com/7.x/adventurer/svg?seed=${char.name}&backgroundColor=ffdfbf`}
              alt={char.name}
              className='w-full h-full object-cover bg-pink-100'
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${char.name}&backgroundColor=ffdfbf`;
                target.onerror = null;
              }}
            />
          </motion.button>
        );
      })}
    </div>
  );
}