import { motion } from 'framer-motion';
import type { LevelConfig } from '../../store/levelStore';
import './LevelTransition.css';

interface LevelTransitionProps {
    config: LevelConfig;
    onContinue: () => void;
}

export function LevelTransition({ config, onContinue }: LevelTransitionProps) {
    // Get difficulty message based on level
    const getDifficultyMessage = (level: number): string => {
        if (level <= 5) return "Warming up...";
        if (level <= 10) return "Getting interesting!";
        if (level <= 20) return "Now we're talking!";
        if (level <= 30) return "Feeling the pressure?";
        if (level <= 40) return "Expert territory!";
        if (level <= 50) return "Master level!";
        return "LEGENDARY!";
    };

    // Get emoji based on level range
    const getLevelEmoji = (level: number): string => {
        if (level <= 5) return "🌊";
        if (level <= 10) return "💧";
        if (level <= 20) return "🔥";
        if (level <= 30) return "⚡";
        if (level <= 40) return "💎";
        if (level <= 50) return "🌟";
        return "👑";
    };

    return (
        <div className="level-transition">
            <div className="level-bg" />

            <motion.div
                className="level-content"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
            >
                {/* Level Number */}
                <motion.div
                    className="level-badge"
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <span className="level-emoji">{getLevelEmoji(config.level)}</span>
                    <span className="level-number">Level {config.level}</span>
                    <span className="level-emoji">{getLevelEmoji(config.level)}</span>
                </motion.div>

                {/* Difficulty Message */}
                <motion.p
                    className="level-message"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {getDifficultyMessage(config.level)}
                </motion.p>

                {/* Stats Grid */}
                <motion.div
                    className="level-stats"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="stat-item">
                        <span className="stat-icon">💧</span>
                        <span className="stat-value">{config.dropsAvailable}</span>
                        <span className="stat-label">Drops</span>
                    </div>
                    {config.emptyCells > 0 && (
                        <div className="stat-item">
                            <span className="stat-icon">⬛</span>
                            <span className="stat-value">{config.emptyCells}</span>
                            <span className="stat-label">Empty</span>
                        </div>
                    )}
                </motion.div>

                {/* Continue Button */}
                <motion.button
                    className="continue-btn"
                    onClick={onContinue}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Continue ▶
                </motion.button>
            </motion.div>
        </div>
    );
}
