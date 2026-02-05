import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import './PowerupBar.css';

// SVG icon components for powerups
const RainIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M8 19v2M8 13v2M16 19v2M16 13v2M12 21v2M12 15v2" />
        <path d="M20 8.5c0-2.5-2-4.5-4.5-4.5-.4 0-.8 0-1.2.2A5 5 0 004 8a4 4 0 00-.5 8h17a3.5 3.5 0 00-.5-7.5z" />
    </svg>
);

const FreezeIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 2v20M17 5l-5 5-5-5M7 19l5-5 5 5M2 12h20M5 7l5 5-5 5M19 17l-5-5 5-5" />
    </svg>
);

const BombIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="11" cy="13" r="8" />
        <path d="M15.5 4.5l2 2M14 6l4-4" />
        <path d="M8 10a3 3 0 013-3" opacity="0.5" />
    </svg>
);

const LaserIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 2L8 8h8l-4-6z" />
        <path d="M12 8v14" />
        <path d="M8 14h8M6 18h12" />
    </svg>
);

const LockIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
);

const POWERUP_INFO = {
    rain: { icon: RainIcon, name: 'Rain', desc: '+1 to 3x3 area', unlockLevel: 1 },
    freeze: { icon: FreezeIcon, name: 'Freeze', desc: 'Free next drop', unlockLevel: 5 },
    bomb: { icon: BombIcon, name: 'Bomb', desc: 'Clear 3x3 area', unlockLevel: 10 },
    laser: { icon: LaserIcon, name: 'Laser', desc: 'Clear row or column', unlockLevel: 15 },
};

type PowerupType = keyof typeof POWERUP_INFO;

interface PowerupBarProps {
    currentLevel: number;
}

export function PowerupBar({ currentLevel }: PowerupBarProps) {
    const { powerups, activePowerup, selectPowerup, useFreezePowerup } = useGameStore();

    const handlePowerupClick = (type: PowerupType) => {
        if (powerups[type] <= 0) return;

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
                const IconComponent = info.icon;

                return (
                    <motion.button
                        key={type}
                        className={`powerup-btn ${isActive ? 'active' : ''} ${!isAvailable ? 'empty' : ''} ${!isUnlocked ? 'locked' : ''}`}
                        onClick={() => isUnlocked && handlePowerupClick(type)}
                        whileHover={isAvailable && isUnlocked ? { scale: 1.08 } : {}}
                        whileTap={isAvailable && isUnlocked ? { scale: 0.95 } : {}}
                        title={isUnlocked ? `${info.name}: ${info.desc}` : `Unlocks at Level ${info.unlockLevel}`}
                        style={{ color: isActive ? '#5eadcf' : 'rgba(160, 180, 200, 0.6)' }}
                    >
                        <span className="powerup-icon"><IconComponent /></span>
                        {isUnlocked && (
                            <span className="powerup-count">{count}</span>
                        )}
                        {!isUnlocked && (
                            <span className="powerup-lock"><LockIcon /></span>
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
}
