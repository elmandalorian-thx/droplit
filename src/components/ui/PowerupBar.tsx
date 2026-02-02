import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import './PowerupBar.css';

const POWERUP_INFO = {
    rain: { icon: '🌧️', name: 'Rain', desc: '+1 to 3x3 area', unlockLevel: 1 },
    freeze: { icon: '❄️', name: 'Freeze', desc: 'Free next drop', unlockLevel: 5 },
    bomb: { icon: '💣', name: 'Bomb', desc: 'Clear 3x3 area', unlockLevel: 10 },
    laser: { icon: '⚡', name: 'Laser', desc: 'Clear row or column', unlockLevel: 15 },
};

type PowerupType = keyof typeof POWERUP_INFO;

interface PowerupBarProps {
    currentLevel: number;
}

export function PowerupBar({ currentLevel }: PowerupBarProps) {
    const { powerups, activePowerup, selectPowerup, useFreezePowerup } = useGameStore();

    const handlePowerupClick = (type: PowerupType) => {
        if (powerups[type] <= 0) return;

        // Freeze is instant, others require target selection
        if (type === 'freeze') {
            useFreezePowerup();
        } else {
            selectPowerup(activePowerup === type ? null : type);
        }
    };

    return (
        <div className="powerup-bar">
            {(Object.keys(POWERUP_INFO) as PowerupType[]).map((type) => {
                const info = POWERUP_INFO[type];
                const count = powerups[type];
                const isUnlocked = currentLevel >= info.unlockLevel;
                const isActive = activePowerup === type;
                const isAvailable = count > 0;

                return (
                    <motion.button
                        key={type}
                        className={`powerup-btn ${isActive ? 'active' : ''} ${!isAvailable ? 'empty' : ''} ${!isUnlocked ? 'locked' : ''}`}
                        onClick={() => isUnlocked && handlePowerupClick(type)}
                        whileHover={isAvailable && isUnlocked ? { scale: 1.1 } : {}}
                        whileTap={isAvailable && isUnlocked ? { scale: 0.95 } : {}}
                        title={isUnlocked ? `${info.name}: ${info.desc}` : `Unlocks at Level ${info.unlockLevel}`}
                    >
                        <span className="powerup-icon">{info.icon}</span>
                        {isUnlocked && (
                            <span className="powerup-count">{count}</span>
                        )}
                        {!isUnlocked && (
                            <span className="powerup-lock">🔒</span>
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
}
