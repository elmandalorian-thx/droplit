import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore'
import { PowerupBar } from './ui/PowerupBar'

interface HUDProps {
    onBackToMenu?: () => void;
    onNextLevel?: () => void;
    onRetry?: () => void;
    onLevelSelect?: () => void;
    playerName?: string;
    currentLevel?: number;
}

const btnBase: React.CSSProperties = {
    padding: '12px 24px',
    fontSize: '0.82rem',
    fontWeight: 500,
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    flex: 1,
    fontFamily: "'Inter', sans-serif",
};

const primaryBtn: React.CSSProperties = {
    ...btnBase,
    background: 'rgba(94, 173, 207, 0.12)',
    color: 'rgba(94, 173, 207, 0.8)',
    border: '1px solid rgba(94, 173, 207, 0.22)',
};

const secondaryBtn: React.CSSProperties = {
    ...btnBase,
    background: 'rgba(200, 215, 230, 0.05)',
    color: 'rgba(200, 215, 230, 0.45)',
    border: '1px solid rgba(100, 150, 180, 0.1)',
};

export function HUD({ onBackToMenu, onNextLevel, onRetry, onLevelSelect, playerName, currentLevel }: HUDProps) {
    const dropsAvailable = useGameStore(state => state.dropsAvailable);
    const status = useGameStore(state => state.status);
    const cellsRemaining = useGameStore(state =>
        state.grid.flat().filter(c => c > 0).length
    );

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '16px 16px calc(16px + var(--safe-bottom, 0px) + 24px) 16px',
            boxSizing: 'border-box',
            fontFamily: "'Inter', sans-serif",
        }}>
            {/* Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                {onBackToMenu && (
                    <button
                        onClick={onBackToMenu}
                        style={{
                            pointerEvents: 'auto',
                            background: 'none',
                            padding: '8px 12px',
                            border: 'none',
                            color: 'rgba(160, 180, 200, 0.4)',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            letterSpacing: '1px',
                        }}
                    >
                        Menu
                    </button>
                )}

                <div style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'baseline',
                    padding: '8px 0',
                }}>
                    {currentLevel && (
                        <span style={{
                            fontSize: '0.7rem',
                            color: 'rgba(160, 180, 200, 0.3)',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                        }}>
                            Lv {currentLevel}
                        </span>
                    )}
                    <span style={{
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        color: 'rgba(200, 215, 230, 0.8)',
                    }}>
                        {dropsAvailable}
                    </span>
                    <span style={{
                        fontSize: '0.65rem',
                        color: 'rgba(160, 180, 200, 0.3)',
                        marginLeft: '-6px',
                    }}>
                        drops
                    </span>
                </div>

                {playerName && (
                    <span style={{
                        fontSize: '0.75rem',
                        color: 'rgba(160, 180, 200, 0.35)',
                        padding: '8px 0',
                    }}>
                        {playerName}
                    </span>
                )}
            </div>

            {/* Result Overlay */}
            <AnimatePresence>
                {status !== 'playing' && (
                    <motion.div
                        key="result-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(11, 17, 32, 0.82)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            pointerEvents: 'auto',
                            zIndex: 50,
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0, y: 16 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.92, opacity: 0 }}
                            transition={{ type: 'spring', damping: 22, stiffness: 280, delay: 0.1 }}
                            style={{
                                background: 'rgba(16, 27, 46, 0.96)',
                                padding: '44px 36px 36px',
                                borderRadius: '22px',
                                textAlign: 'center',
                                border: '1px solid rgba(100, 150, 180, 0.1)',
                                minWidth: '270px',
                                maxWidth: '310px',
                            }}
                        >
                            {status === 'won' ? (
                                <>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.25 }}
                                        style={{
                                            width: 52,
                                            height: 52,
                                            borderRadius: '50%',
                                            background: 'rgba(94, 173, 207, 0.1)',
                                            border: '2px solid rgba(94, 173, 207, 0.25)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 18px',
                                        }}
                                    >
                                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#5eadcf" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </motion.div>

                                    <h2 style={{
                                        margin: '0 0 6px',
                                        fontSize: '1.25rem',
                                        fontWeight: 300,
                                        color: 'rgba(110, 198, 216, 0.85)',
                                        letterSpacing: '1px',
                                    }}>
                                        Level {currentLevel} Cleared
                                    </h2>

                                    <p style={{
                                        margin: '0 0 28px',
                                        fontSize: '0.78rem',
                                        color: 'rgba(160, 180, 200, 0.38)',
                                    }}>
                                        {dropsAvailable} drops remaining
                                    </p>

                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={onNextLevel} style={primaryBtn}>
                                            Next Level
                                        </button>
                                        <button onClick={onLevelSelect} style={secondaryBtn}>
                                            Levels
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2 style={{
                                        margin: '0 0 6px',
                                        fontSize: '1.25rem',
                                        fontWeight: 300,
                                        color: 'rgba(200, 215, 230, 0.55)',
                                        letterSpacing: '1px',
                                    }}>
                                        No Drops Left
                                    </h2>

                                    <p style={{
                                        margin: '0 0 28px',
                                        fontSize: '0.78rem',
                                        color: 'rgba(160, 180, 200, 0.35)',
                                    }}>
                                        {cellsRemaining} cell{cellsRemaining !== 1 ? 's' : ''} remaining — keep trying.
                                    </p>

                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={onRetry} style={primaryBtn}>
                                            Try Again
                                        </button>
                                        <button onClick={onLevelSelect} style={secondaryBtn}>
                                            Levels
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom controls */}
            <div style={{
                pointerEvents: 'auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
            }}>
                {currentLevel && <PowerupBar currentLevel={currentLevel} />}

                <button onClick={onRetry} style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(160, 180, 200, 0.3)',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    letterSpacing: '1px',
                }}>
                    Reset
                </button>
            </div>
        </div>
    )
}
