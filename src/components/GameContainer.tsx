import { useRef, useEffect } from 'react';
import { useGameStore, GRID_ROWS, GRID_COLS } from '../store/gameStore';
import { Cell2D } from './Cell2D';
import { Projectile2D } from './Projectile2D';
import { soundManager } from '../utils/SoundManager';
import './GameContainer.css';

export function GameContainer() {
    const projectiles = useGameStore(state => state.projectiles);
    const explosions = useGameStore(state => state.explosions);
    const prevExplosionCount = useRef(0);

    // Play sound on new explosions
    useEffect(() => {
        if (explosions.length > prevExplosionCount.current) {
            soundManager.playExplosion();
        }
        prevExplosionCount.current = explosions.length;
    }, [explosions]);

    // Generate cell positions
    const cells = [];
    for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
            cells.push({ row: r, col: c, key: `${r}-${c}` });
        }
    }

    return (
        <div className="game-container">
            {/* SVG Gooey Filter Definition */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <defs>
                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                            result="goo"
                        />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                </defs>
            </svg>

            {/* Grid with Gooey Effect */}
            <div className="grid-wrapper" style={{ filter: 'url(#goo)' }}>
                {cells.map(({ row, col, key }) => (
                    <Cell2D key={key} row={row} col={col} />
                ))}
            </div>

            {/* Projectiles Layer */}
            <div className="projectiles-layer">
                {projectiles.map(p => (
                    <Projectile2D key={p.id} projectile={p} />
                ))}
            </div>


        </div>
    );
}

