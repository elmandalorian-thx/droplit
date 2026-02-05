import { create } from 'zustand';

export const GRID_ROWS = 8;
export const GRID_COLS = 6;
export const INITIAL_DROPS = 40;

export type CellValue = 0 | 1 | 2 | 3;
type GridState = CellValue[][];

type GameStatus = 'playing' | 'won' | 'lost';

export interface Projectile {
    id: string;
    start: [number, number]; // [col, row]
    end: [number, number];
    targetPos: [number, number]; // [row, col]
    hasTarget: boolean;
}

export interface Explosion {
    id: string;
    position: [number, number]; // [row, col]
}

interface GameState {
    grid: GridState;
    dropsAvailable: number;
    status: GameStatus;
    projectiles: Projectile[];
    explosions: Explosion[];
    isProcessing: boolean;

    powerups: {
        rain: number;
        freeze: number;
        bomb: number;
        laser: number;
    };
    activePowerup: 'rain' | 'freeze' | 'bomb' | 'laser' | null;
    isFrozen: boolean;
    currentCombo: number;
    currentLevel: number;

    // Actions
    addDrop: (row: number, col: number) => void;
    triggerChainReactions: (explosions: [number, number][], depth?: number) => void;
    resolveProjectiles: (projectiles: Projectile[], depth?: number) => void;
    checkWinCondition: () => void;
    resetGame: () => void;
    initializeLevel: (config: { dropsAvailable: number; emptyCells: number; redRatio: number; orangeRatio: number }, level: number) => void;

    selectPowerup: (type: 'rain' | 'freeze' | 'bomb' | 'laser' | null) => void;
    useRainPowerup: (centerRow: number, centerCol: number) => void;
    useBombPowerup: (row: number, col: number) => void;
    useLaserPowerup: (row: number, col: number, direction: 'row' | 'col') => void;
    useFreezePowerup: () => void;
}

const isValid = (r: number, c: number) => r >= 0 && r < GRID_ROWS && c >= 0 && c < GRID_COLS;

const createEmptyGrid = (): GridState => {
    return Array(GRID_ROWS).fill(0).map(() =>
        Array(GRID_COLS).fill(0)
    ) as GridState;
};

const findTargetInDirection = (grid: GridState, startRow: number, startCol: number, dRow: number, dCol: number): { target: [number, number], hasTarget: boolean } => {
    let r = startRow + dRow;
    let c = startCol + dCol;
    let lastValidR = startRow;
    let lastValidC = startCol;

    while (isValid(r, c)) {
        if (grid[r][c] > 0) {
            return { target: [r, c], hasTarget: true };
        }
        lastValidR = r;
        lastValidC = c;
        r += dRow;
        c += dCol;
    }

    const edgeR = lastValidR + dRow;
    const edgeC = lastValidC + dCol;
    return { target: [edgeR, edgeC], hasTarget: false };
};

const MAX_CHAIN_DEPTH = 30;

export const useGameStore = create<GameState>((set, get) => ({
    grid: createEmptyGrid(),
    dropsAvailable: INITIAL_DROPS,
    status: 'playing',
    projectiles: [],
    explosions: [],
    isProcessing: false,
    powerups: { rain: 1, freeze: 0, bomb: 0, laser: 0 },
    activePowerup: null,
    isFrozen: false,
    currentCombo: 0,
    currentLevel: 1,

    addDrop: (row: number, col: number) => {
        const state = get();
        if (state.status !== 'playing' || state.isProcessing) return;
        if (state.dropsAvailable <= 0 && !state.isFrozen) return;

        const newDropsAvailable = state.isFrozen ? state.dropsAvailable : state.dropsAvailable - 1;

        const newGrid = state.grid.map(r => [...r]);
        newGrid[row][col] += 1;

        set({
            grid: newGrid,
            dropsAvailable: newDropsAvailable,
            isFrozen: false,
            currentCombo: 0,
        });

        if (newGrid[row][col] > 3) {
            get().triggerChainReactions([[row, col]]);
        } else {
            get().checkWinCondition();
        }
    },

    // Batched: processes ALL explosions in one pass, single timeout
    triggerChainReactions: (explosionCells: [number, number][], depth: number = 0) => {
        if (depth > MAX_CHAIN_DEPTH) {
            const newGrid = get().grid.map(r => [...r]);
            for (let r = 0; r < GRID_ROWS; r++) {
                for (let c = 0; c < GRID_COLS; c++) {
                    if (newGrid[r][c] > 3) newGrid[r][c] = 0 as CellValue;
                }
            }
            set({ grid: newGrid });
            get().checkWinCondition();
            return;
        }

        set({ isProcessing: true });
        const state = get();
        const newGrid = state.grid.map(r => [...r]);

        for (const [r, c] of explosionCells) {
            newGrid[r][c] = 0;
        }
        set({ grid: newGrid });

        const allProjectiles: Projectile[] = [];
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        for (const [er, ec] of explosionCells) {
            for (const [dr, dc] of directions) {
                const result = findTargetInDirection(newGrid, er, ec, dr, dc);
                const [tr, tc] = result.target;
                allProjectiles.push({
                    id: Math.random().toString(36).substring(2),
                    start: [ec, er],
                    end: [tc, tr],
                    targetPos: [tr, tc],
                    hasTarget: result.hasTarget,
                });
            }
        }

        set(s => ({
            projectiles: [...s.projectiles, ...allProjectiles],
            currentCombo: s.currentCombo + explosionCells.length,
        }));

        const d = depth;
        setTimeout(() => {
            get().resolveProjectiles(allProjectiles, d);
        }, 450);
    },

    resolveProjectiles: (completedProjectiles: Projectile[], depth: number = 0) => {
        try {
            const state = get();
            const completedIds = new Set(completedProjectiles.map(p => p.id));
            const remaining = state.projectiles.filter(p => !completedIds.has(p.id));
            set({ projectiles: remaining });

            const newGrid = state.grid.map(r => [...r]);
            const nextExplosions: [number, number][] = [];
            const newVisualExplosions: Explosion[] = [];

            for (const p of completedProjectiles) {
                if (!p.hasTarget) continue;
                const [r, c] = p.targetPos;
                if (!isValid(r, c)) continue;

                newGrid[r][c] += 1;

                newVisualExplosions.push({
                    id: Math.random().toString(36).substring(2),
                    position: [r, c],
                });

                if (newGrid[r][c] > 3) {
                    if (!nextExplosions.some(([er, ec]) => er === r && ec === c)) {
                        nextExplosions.push([r, c]);
                    }
                }
            }

            set(s => ({
                grid: newGrid,
                explosions: [...s.explosions, ...newVisualExplosions],
            }));

            if (newVisualExplosions.length > 0) {
                const ids = new Set(newVisualExplosions.map(e => e.id));
                setTimeout(() => {
                    set(s => ({
                        explosions: s.explosions.filter(e => !ids.has(e.id)),
                    }));
                }, 800);
            }

            if (nextExplosions.length > 0) {
                get().triggerChainReactions(nextExplosions, depth + 1);
            } else {
                get().checkWinCondition();
            }
        } catch (e) {
            console.error('Game loop error:', e);
            set({ isProcessing: false });
        }
    },

    checkWinCondition: () => {
        const state = get();
        const isEmpty = state.grid.every(r => r.every(c => c === 0));
        if (isEmpty) {
            set({ status: 'won', isProcessing: false });
        } else if (state.dropsAvailable <= 0 && !state.isFrozen) {
            set({ status: 'lost', isProcessing: false });
        } else {
            set({ isProcessing: false });
        }
    },

    resetGame: () => {
        const state = get();
        const level = state.currentLevel;
        set({
            grid: createEmptyGrid(),
            dropsAvailable: INITIAL_DROPS,
            status: 'playing',
            projectiles: [],
            explosions: [],
            isProcessing: false,
            powerups: {
                rain: 1,
                freeze: level >= 5 ? 1 : 0,
                bomb: level >= 10 ? 1 : 0,
                laser: level >= 15 ? 1 : 0,
            },
            activePowerup: null,
            isFrozen: false,
            currentCombo: 0,
        });
    },

    initializeLevel: (config, level) => {
        const totalCells = GRID_ROWS * GRID_COLS;
        const filledCells = totalCells - config.emptyCells;

        const redCount = Math.floor(filledCells * config.redRatio);
        const orangeCount = Math.floor(filledCells * config.orangeRatio);
        const tealCount = filledCells - redCount - orangeCount;

        const cells: CellValue[] = [
            ...Array(redCount).fill(3),
            ...Array(orangeCount).fill(2),
            ...Array(tealCount).fill(1),
            ...Array(config.emptyCells).fill(0),
        ] as CellValue[];

        for (let i = cells.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cells[i], cells[j]] = [cells[j], cells[i]];
        }

        const grid: GridState = [];
        for (let r = 0; r < GRID_ROWS; r++) {
            grid.push(cells.slice(r * GRID_COLS, (r + 1) * GRID_COLS));
        }

        set({
            grid,
            dropsAvailable: config.dropsAvailable,
            status: 'playing',
            projectiles: [],
            explosions: [],
            isProcessing: false,
            powerups: {
                rain: 1,
                freeze: level >= 5 ? 1 : 0,
                bomb: level >= 10 ? 1 : 0,
                laser: level >= 15 ? 1 : 0,
            },
            activePowerup: null,
            isFrozen: false,
            currentCombo: 0,
            currentLevel: level,
        });
    },

    selectPowerup: (type) => set({ activePowerup: type }),

    useRainPowerup: (centerRow, centerCol) => {
        const state = get();
        if (state.status !== 'playing' || state.isProcessing) return;
        if (state.powerups.rain <= 0) return;

        set(s => ({
            powerups: { ...s.powerups, rain: s.powerups.rain - 1 },
            activePowerup: null,
        }));

        const newGrid = state.grid.map(r => [...r]);
        const explosions: [number, number][] = [];

        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const r = centerRow + dr;
                const c = centerCol + dc;
                if (isValid(r, c)) {
                    newGrid[r][c] = Math.min(newGrid[r][c] + 1, 4) as CellValue;
                    if (newGrid[r][c] > 3) {
                        if (!explosions.some(([er, ec]) => er === r && ec === c)) {
                            explosions.push([r, c]);
                        }
                    }
                }
            }
        }

        set({ grid: newGrid });

        if (explosions.length > 0) {
            get().triggerChainReactions(explosions);
        } else {
            get().checkWinCondition();
        }
    },

    useBombPowerup: (centerRow, centerCol) => {
        const state = get();
        if (state.status !== 'playing' || state.isProcessing) return;
        if (state.powerups.bomb <= 0) return;

        set(s => ({
            powerups: { ...s.powerups, bomb: s.powerups.bomb - 1 },
            activePowerup: null,
        }));

        const newGrid = state.grid.map(r => [...r]);
        const cleared: [number, number][] = [];

        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const r = centerRow + dr;
                const c = centerCol + dc;
                if (isValid(r, c) && newGrid[r][c] > 0) {
                    cleared.push([r, c]);
                    newGrid[r][c] = 0;
                }
            }
        }

        set({
            grid: newGrid,
            explosions: cleared.map(p => ({
                id: Math.random().toString(36).substring(2),
                position: p,
            })),
        });

        setTimeout(() => {
            set({ explosions: [] });
            get().checkWinCondition();
        }, 500);
    },

    useLaserPowerup: (row, col, direction) => {
        const state = get();
        if (state.status !== 'playing' || state.isProcessing) return;
        if (state.powerups.laser <= 0) return;

        set(s => ({
            powerups: { ...s.powerups, laser: s.powerups.laser - 1 },
            activePowerup: null,
        }));

        const newGrid = state.grid.map(r => [...r]);
        const cleared: [number, number][] = [];

        if (direction === 'row') {
            for (let c = 0; c < GRID_COLS; c++) {
                if (newGrid[row][c] > 0) {
                    cleared.push([row, c]);
                    newGrid[row][c] = 0;
                }
            }
        } else {
            for (let r = 0; r < GRID_ROWS; r++) {
                if (newGrid[r][col] > 0) {
                    cleared.push([r, col]);
                    newGrid[r][col] = 0;
                }
            }
        }

        set({
            grid: newGrid,
            explosions: cleared.map(p => ({
                id: Math.random().toString(36).substring(2),
                position: p,
            })),
        });

        setTimeout(() => {
            set({ explosions: [] });
            get().checkWinCondition();
        }, 500);
    },

    useFreezePowerup: () => {
        const state = get();
        if (state.status !== 'playing' || state.isProcessing) return;
        if (state.powerups.freeze <= 0) return;

        set(s => ({
            powerups: { ...s.powerups, freeze: s.powerups.freeze - 1 },
            activePowerup: null,
            isFrozen: true,
        }));
    },
}));
