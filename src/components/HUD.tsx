import { useGameStore } from '../store/gameStore'
import { PowerupBar } from './ui/PowerupBar'

interface HUDProps {
    onBackToMenu?: () => void;
    playerName?: string;
    currentLevel?: number;
}

export function HUD({ onBackToMenu, playerName, currentLevel }: HUDProps) {
    const { dropsAvailable, status, resetGame } = useGameStore();

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
            padding: '20px 20px calc(20px + var(--safe-bottom, 0px) + 24px) 20px',
            boxSizing: 'border-box',
            color: 'var(--zen-text, rgba(200, 215, 230, 0.9))',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                {onBackToMenu && (
                    <button
                        onClick={onBackToMenu}
                        style={{
                            pointerEvents: 'auto',
                            background: 'rgba(11, 17, 32, 0.7)',
                            padding: '8px 16px',
                            borderRadius: '12px',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(100, 150, 180, 0.12)',
                            color: 'rgba(200, 215, 230, 0.7)',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        Menu
                    </button>
                )}

                {/* Level & Drops Counter */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(11, 17, 32, 0.7)',
                    padding: '10px 24px',
                    borderRadius: '20px',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(100, 150, 180, 0.1)',
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center',
                }}>
                    {currentLevel && (
                        <span style={{ fontSize: '0.8rem', color: 'rgba(160, 180, 200, 0.5)', letterSpacing: '1px', textTransform: 'uppercase' as const }}>Lv {currentLevel}</span>
                    )}
                    <span style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'rgba(200, 215, 230, 0.9)', letterSpacing: '0.5px' }}>{dropsAvailable}</span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(160, 180, 200, 0.4)', marginLeft: '-10px' }}>drops</span>
                </div>

                {playerName && (
                    <div style={{
                        background: 'rgba(11, 17, 32, 0.7)',
                        padding: '8px 16px',
                        borderRadius: '12px',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(100, 150, 180, 0.1)',
                        fontSize: '0.8rem',
                        color: 'rgba(160, 180, 200, 0.6)',
                    }}>
                        {playerName}
                    </div>
                )}
            </div>

            {/* Game Over / Win Modal - Zen styled */}
            {status !== 'playing' && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(11, 17, 32, 0.92)',
                    padding: '48px 40px',
                    borderRadius: '24px',
                    textAlign: 'center',
                    color: 'rgba(200, 215, 230, 0.9)',
                    pointerEvents: 'auto',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(100, 150, 180, 0.15)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                    minWidth: '280px',
                }}>
                    <h1 style={{
                        margin: '0 0 12px 0',
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        letterSpacing: '2px',
                        color: status === 'won' ? '#6ec6d8' : 'rgba(200, 215, 230, 0.6)',
                    }}>
                        {status === 'won' ? 'Cleared' : 'No Drops Left'}
                    </h1>
                    <p style={{
                        fontSize: '1rem',
                        marginBottom: '32px',
                        color: 'rgba(160, 180, 200, 0.5)',
                        fontStyle: 'italic',
                    }}>
                        {status === 'won' ? 'Well played.' : 'Try a different approach.'}
                    </p>
                    <button
                        onClick={resetGame}
                        style={{
                            padding: '14px 40px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            background: 'rgba(94, 173, 207, 0.15)',
                            color: '#5eadcf',
                            border: '1px solid rgba(94, 173, 207, 0.3)',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            letterSpacing: '1px',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(94, 173, 207, 0.25)';
                            e.currentTarget.style.transform = 'scale(1.03)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(94, 173, 207, 0.15)';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Bottom controls */}
            <div style={{ pointerEvents: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                {currentLevel && <PowerupBar currentLevel={currentLevel} />}

                <button onClick={resetGame} style={{
                    background: 'rgba(11, 17, 32, 0.7)',
                    border: '1px solid rgba(100, 150, 180, 0.12)',
                    color: 'rgba(160, 180, 200, 0.5)',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    backdropFilter: 'blur(12px)',
                    fontSize: '0.8rem',
                    transition: 'all 0.2s ease',
                }}>
                    Reset
                </button>
            </div>
        </div>
    )
}
