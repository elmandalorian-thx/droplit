import { useGameStore } from '../store/gameStore'

export function HUD() {
    const { dropsAvailable, status, resetGame } = useGameStore();

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none', // Allow clicking through to canvas
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '20px',
            boxSizing: 'border-box',
            color: 'white',
            fontFamily: 'Inter, sans-serif'
        }}>
            {/* Top Bar */}
            <div style={{ alignSelf: 'center', background: 'rgba(0,0,0,0.5)', padding: '10px 20px', borderRadius: '20px', backdropFilter: 'blur(5px)' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Drops: {dropsAvailable}</h2>
            </div>

            {/* Game Over / Win Modal */}
            {status !== 'playing' && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(255,255,255,0.9)',
                    padding: '40px',
                    borderRadius: '20px',
                    textAlign: 'center',
                    color: '#333',
                    pointerEvents: 'auto', // Re-enable clicks
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}>
                    <h1 style={{ margin: '0 0 20px 0', fontSize: '3rem' }}>
                        {status === 'won' ? 'LEVEL CLEARED!' : 'OUT OF DROPS'}
                    </h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
                        {status === 'won' ? 'Splendid work!' : 'Better luck next time.'}
                    </p>
                    <button
                        onClick={resetGame}
                        style={{
                            padding: '15px 40px',
                            fontSize: '1.2rem',
                            background: '#4facfe',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            transition: 'transform 0.1s',
                            boxShadow: '0 5px 15px rgba(79, 172, 254, 0.4)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Bottom controls (Reset if stuck) */}
            <div style={{ pointerEvents: 'auto', alignSelf: 'flex-end' }}>
                <button onClick={resetGame} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>
                    Reset Level
                </button>
            </div>
        </div>
    )
}
