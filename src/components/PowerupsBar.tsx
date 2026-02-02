import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export function PowerupsBar() {
    const powerups = useGameStore(state => state.powerups);
    const activePowerup = useGameStore(state => state.activePowerup);
    const selectPowerup = useGameStore(state => state.selectPowerup);

    const isSelected = activePowerup === 'rain';
    const isDisabled = powerups.rain <= 0;

    const handleClick = () => {
        if (isDisabled) return;
        selectPowerup(isSelected ? null : 'rain');
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 16,
            padding: '12px 24px',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(12px)',
            borderRadius: 24,
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}>
            <motion.button
                onClick={handleClick}
                disabled={isDisabled}
                whileHover={{ scale: isDisabled ? 1 : 1.1 }}
                whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                animate={{
                    boxShadow: isSelected
                        ? '0 0 20px rgba(79, 172, 254, 0.8), 0 0 40px rgba(79, 172, 254, 0.4)'
                        : '0 4px 16px rgba(0, 0, 0, 0.3)',
                }}
                style={{
                    position: 'relative',
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    border: isSelected ? '2px solid #4facfe' : '2px solid rgba(255,255,255,0.2)',
                    background: isDisabled
                        ? 'rgba(100, 100, 100, 0.4)'
                        : 'linear-gradient(135deg, rgba(79, 172, 254, 0.3), rgba(79, 172, 254, 0.1))',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    opacity: isDisabled ? 0.5 : 1,
                }}
            >
                🌧️
                {/* Badge showing count */}
                <span style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    minWidth: 20,
                    height: 20,
                    borderRadius: 10,
                    background: isDisabled ? '#666' : '#4facfe',
                    border: '2px solid #1a1a2e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#fff',
                }}>
                    {powerups.rain}
                </span>
            </motion.button>
        </div>
    );
}
