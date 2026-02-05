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
                            textTransform: 'uppercase' as const,
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

            {/* Game Over / Win Modal */}
            {status !== 'playing' && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(11, 17, 32, 0.94)',
                    padding: '48px 40px',
                    borderRadius: '20px',
                    textAlign: 'center',
                    pointerEvents: 'auto',
                    border: '1px solid rgba(100, 150, 180, 0.08)',
                    minWidth: '260px',
                }}>
                    <h1 style={{
                        margin: '0 0 8px 0',
                        fontSize: '1.5rem',
                        fontWeight: 300,
                        letterSpacing: '2px',
                        color: status === 'won'
                            ? 'rgba(110, 198, 216, 0.8)'
                            : 'rgba(200, 215, 230, 0.5)',
                    }}>
                        {status === 'won' ? 'Cleared' : 'No Drops Left'}
                    </h1>
                    <p style={{
                        fontSize: '0.85rem',
                        marginBottom: '32px',
                        color: 'rgba(160, 180, 200, 0.35)',
                    }}>
                        {status === 'won' ? 'Well played.' : 'Try a different approach.'}
                    </p>
                    <button
                        onClick={resetGame}
                        style={{
                            padding: '12px 36px',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            background: 'rgba(94, 173, 207, 0.1)',
                            color: 'rgba(94, 173, 207, 0.7)',
                            border: '1px solid rgba(94, 173, 207, 0.2)',
                            borderRadius: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            letterSpacing: '1px',
                            textTransform: 'uppercase' as const,
                        }}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Bottom controls */}
            <div style={{
                pointerEvents: 'auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
            }}>
                {currentLevel && <PowerupBar currentLevel={currentLevel} />}

                <button onClick={resetGame} style={{
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
