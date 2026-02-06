import { motion } from 'framer-motion';
import type { LevelConfig } from '../../store/levelStore';
import './LevelTransition.css';

interface LevelTransitionProps {
    config: LevelConfig;
    onContinue: () => void;
}

const POWERUP_UNLOCKS: Record<number, string> = {
    5: 'Freeze',
    10: 'Bomb',
    15: 'Laser',
};

export function LevelTransition({ config, onContinue }: LevelTransitionProps) {
    const getDifficultyMessage = (level: number): string => {
        if (level <= 5) return "Breathe and observe.";
        if (level <= 10) return "Patterns emerge.";
        if (level <= 20) return "Flow with intention.";
        if (level <= 30) return "Deeper waters.";
        if (level <= 40) return "Mastery in stillness.";
        if (level <= 50) return "One with the current.";
        return "Beyond.";
    };

    const unlockName = POWERUP_UNLOCKS[config.level];

    return (
        <div className="level-transition">
            <div className="level-bg" />

            <motion.div
                className="level-content"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <motion.div
                    className="level-badge"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <span className="level-label">Level</span>
                    <span className="level-number">{config.level}</span>
                </motion.div>

                <motion.p
                    className="level-message"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    {getDifficultyMessage(config.level)}
                </motion.p>

                {unlockName && (
                    <motion.div
                        className="unlock-badge"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.55, type: 'spring', damping: 15 }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                        {unlockName} unlocked
                    </motion.div>
                )}

                <motion.div
                    className="level-stats"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="stat-item">
                        <span className="stat-value">{config.dropsAvailable}</span>
                        <span className="stat-label">Drops</span>
                    </div>
                    {config.emptyCells > 0 && (
                        <div className="stat-item">
                            <span className="stat-value">{config.emptyCells}</span>
                            <span className="stat-label">Empty</span>
                        </div>
                    )}
                </motion.div>

                <motion.button
                    className="continue-btn"
                    onClick={onContinue}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    Begin
                </motion.button>
            </motion.div>
        </div>
    );
}
