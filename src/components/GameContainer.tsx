import { useRef, useEffect, useMemo } from 'react';
import { useGameStore, GRID_ROWS, GRID_COLS } from '../store/gameStore';
import { Cell2D } from './Cell2D';
import { Projectile2D } from './Projectile2D';
import { soundManager } from '../utils/SoundManager';
import './GameContainer.css';

export function GameContainer() {
    const projectiles = useGameStore(state => state.projectiles);
    const explosions = useGameStore(state => state.explosions);
    const prevExplosionCount = useRef(0);

    useEffect(() => {
        if (explosions.length > prevExplosionCount.current) {
            soundManager.playExplosion();
        }
        prevExplosionCount.current = explosions.length;
    }, [explosions]);

    // Memoize cell positions - never changes
    const cells = useMemo(() => {
        const result = [];
        for (let r = 0; r < GRID_ROWS; r++) {
            for (let c = 0; c < GRID_COLS; c++) {
                result.push({ row: r, col: c, key: `${r}-${c}` });
            }
        }
        return result;
    }, []);

    return (
        <div className="game-container">
            <div className="grid-wrapper">
                {cells.map(({ row, col, key }) => (
                    <Cell2D key={key} row={row} col={col} />
                ))}
            </div>

            <div className="projectiles-layer">
                {projectiles.map(p => (
                    <Projectile2D key={p.id} projectile={p} />
                ))}
            </div>
        </div>
    );
}
