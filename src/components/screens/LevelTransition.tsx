import { motion } from 'framer-motion';
import type { LevelConfig } from '../../store/levelStore';
import './LevelTransition.css';

interface LevelTransitionProps {
    config: LevelConfig;
    onContinue: () => void;
}

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
