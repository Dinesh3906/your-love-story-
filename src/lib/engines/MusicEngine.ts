import { Scene } from '../../store/gameStore';

export const MOOD_MUSIC_MAP: Record<string, string> = {
    'nostalgic': '/audio/nostalgic.mp3',
    'memory': '/audio/nostalgic.mp3',
    'past': '/audio/nostalgic.mp3',
    'reminiscing': '/audio/nostalgic.mp3',
    'sad': '/audio/sad.mp3',
    'lonely': '/audio/sad.mp3',
    'depressing': '/audio/sad.mp3',
    'sorrow': '/audio/sad.mp3',
    'grief': '/audio/sad.mp3',
    'hopeful': '/audio/hopeful.mp3',
    'optimistic': '/audio/hopeful.mp3',
    'dream': '/audio/hopeful.mp3',
    'future': '/audio/hopeful.mp3',
    'tense': '/audio/tense.mp3',
    'angry': '/audio/tense.mp3',
    'danger': '/audio/tense.mp3',
    'scary': '/audio/tense.mp3',
    'threat': '/audio/tense.mp3',
    'fear': '/audio/tense.mp3',
    'solipsism': '/audio/tense.mp3',
    'betrayal': '/audio/tense.mp3',
    'confrontation': '/audio/tense.mp3',
    'playful': '/audio/playful.mp3',
    'fun': '/audio/playful.mp3',
    'happy': '/audio/playful.mp3',
    'cute': '/audio/playful.mp3',
    'pieces': '/audio/playful.mp3',
    'banter': '/audio/playful.mp3',
    'triumphant': '/audio/triumphant.mp3',
    'victory': '/audio/triumphant.mp3',
    'success': '/audio/triumphant.mp3',
    'departure': '/audio/triumphant.mp3',
    'mystery': '/audio/mystery.mp3',
    'secret': '/audio/mystery.mp3',
    'strange': '/audio/mystery.mp3',
    'lilium': '/audio/mystery.mp3',
    'discovery': '/audio/mystery.mp3',
    'heart of darkness': '/audio/mystery.mp3',
    'villain': '/audio/mystery.mp3',
    'darkness': '/audio/mystery.mp3',
    'heartwarming': '/audio/heartwarming.mp3',
    'love': '/audio/heartwarming.mp3',
    'kind': '/audio/heartwarming.mp3',
    'sweet': '/audio/heartwarming.mp3',
    'ocean view': '/audio/heartwarming.mp3',
    'vulnerable': '/audio/heartwarming.mp3',
    'understanding': '/audio/heartwarming.mp3',
    'comfort': '/audio/heartwarming.mp3',
    'bittersweet': '/audio/bittersweet.mp3',
    'takaramono': '/audio/bittersweet.mp3',
    'farewell': '/audio/bittersweet.mp3',
    'parting': '/audio/bittersweet.mp3',
};

export const getMoodFromScene = (scene: Scene | null | undefined): string | undefined => {
    if (!scene) return undefined;

    const moodField = (scene.mood || '').toLowerCase();
    const dialogue = (scene.dialogue || '').toLowerCase();
    const summary = (scene.summary || '').toLowerCase();
    const tension = scene.tension || 0;

    // 1. Explicit AI Keyword Check (Highest Priority)
    const explicitMatch = Object.keys(MOOD_MUSIC_MAP).find(key => moodField.startsWith(key));
    if (explicitMatch) {
        return explicitMatch;
    }

    // 2. High Tension Override
    if (tension > 80) {
        return 'tense';
    }
    if (tension > 60) {
        return 'mystery';
    }

    // 3. Keyword scanning in Dialogue & Mood
    const fullText = `${moodField} ${dialogue} ${summary}`;

    // Priority Keywords (Short strings or specific anime terms)
    if (fullText.includes('solipsism')) return 'tense';
    if (fullText.includes('heart of darkness')) return 'mystery';
    if (fullText.includes('villain')) return 'mystery';
    if (fullText.includes('lilium')) return 'mystery';
    if (fullText.includes('departure')) return 'triumphant';
    if (fullText.includes('takaramono')) return 'bittersweet';
    if (fullText.includes('pieces')) return 'playful';

    // 4. Scan for any keyword in the map
    const sortedKeys = Object.keys(MOOD_MUSIC_MAP).sort((a, b) => b.length - a.length);
    const anyMatch = sortedKeys.find(key => fullText.includes(key));

    return anyMatch;
};

export const getMusicSrc = (scene: Scene | null | undefined): string => {
    const moodKey = getMoodFromScene(scene);
    return moodKey ? MOOD_MUSIC_MAP[moodKey] : '/sparkle.mp3';
};
