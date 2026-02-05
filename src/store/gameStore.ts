import { create } from 'zustand';

export const GRID_ROWS = 8;
export const GRID_COLS = 6;
export const INITIAL_DROPS = 40;

export type CellValue = 0 | 1 | 2 | 3; // 0=empty, 1=blue, 2=purple, 3=red
// stored as flat array or 2D. Let's use 2D for easier coord math.
type GridState = CellValue[][];

type GameStatus = 'playing' | 'won' | 'lost';

export interface Projectile {
    id: string;
    start: [number, number]; // [col, row]
    end: [number, number];
    targetPos: [number, number]; // [row, col] specific to grid
    hasTarget: boolean; // true = will merge with drop, false = fades off-screen
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

    // Powerups - each has 1 use per level
    powerups: {
        rain: number;
        freeze: number;
        bomb: number;
        laser: number;
    };
    activePowerup: 'rain' | 'freeze' | 'bomb' | 'laser' | null;
    isFrozen: boolean; // For freeze powerup
    currentCombo: number; // Track current chain length

    // Actions
    addDrop: (row: number, col: number) => void;
    triggerChainReaction: (row: number, col: number) => void;
    resolveProjectiles: (projectiles: Projectile[]) => void;
    checkWinCondition: () => void;
    resetGame: () => void;
    initializeLevel: (config: { dropsAvailable: number; emptyCells: number; redRatio: number; orangeRatio: number }, level: number) => void;

    // Powerup Actions
    selectPowerup: (type: 'rain' | 'freeze' | 'bomb' | 'laser' | null) => void;
    useRainPowerup: (centerRow: number, centerCol: number) => void;
    useBombPowerup: (row: number, col: number) => void;
    useLaserPowerup: (row: number, col: number, direction: 'row' | 'col') => void;
    useFreezePowerup: () => void;
    unfreeze: () => void;
}

// Helper to check if coord is valid
const isValid = (r: number, c: number) => r >= 0 && r < GRID_ROWS && c >= 0 && c < GRID_COLS;

// Helper to create a random initial grid
const createRandomGrid = (): GridState => {
    return Array(GRID_ROWS).fill(0).map(() =>
        Array(GRID_COLS).fill(0).map(() => {
            const rand = Math.random();
            if (rand > 0.85) return 3;
            if (rand > 0.6) return 2;
            return 1;
        })
    ) as GridState;
};

// Receiver helper: Find the first non-empty cell in a direction, or edge of grid if none
const findTargetInDirection = (grid: GridState, startRow: number, startCol: number, dRow: number, dCol: number): { target: [number, number], hasTarget: boolean } => {
    let r = startRow + dRow;
    let c = startCol + dCol;
    let lastValidR = startRow;
    let lastValidC = startCol;

    while (isValid(r, c)) {
        if (grid[r][c] > 0) {
            return { target: [r, c], hasTarget: true }; // Hit a drop!
        }
        lastValidR = r;
        lastValidC = c;
        r += dRow;
        c += dCol;
    }

    // No drop found - return edge position (or one step beyond for off-screen fade)
    // Calculate position just outside grid for fade-off effect
    const edgeR = lastValidR + dRow;
    const edgeC = lastValidC + dCol;
    return { target: [edgeR, edgeC], hasTarget: false };
};

// Recursive explosion logic


export const useGameStore = create<GameState>((set, get) => ({
    grid: createRandomGrid(),
    // User request: "start with 4... start with 40". 
    // "You might also have a set number of droplets available... start with 40".
    // The grid usually starts with SOME droplets already placed for a puzzle? 
    // User provided images show some existing drops.
    // "Start with 40" refers to AMMO. 
    // The grid initialization probably needs some pre-filled spots for a puzzle.
    // For now, I'll initialize with a random easy setup or empty?
    // Let's make a simple level generator or fully random for now.
    // "start with 4 and you could lose all the droplets" -> Implies ammo.
    // Use images as reference: lots of blue/purple/red dots.
    // I will create a `initLevel` helper later. For now, random seed.

    // State properties are defined above in initial state via resetGame? 
    // No, zustand init.
    // I need to be careful not to duplicate keys in the object literal.
    // The previous edit might have introduced duplicates.
    // Let's ensure a clean object structure.

    // Actions are below:

    dropsAvailable: INITIAL_DROPS,
    status: 'playing',
    projectiles: [],
    explosions: [],
    isProcessing: false,
    // Powerups state - 1 use per powerup per level
    powerups: { rain: 1, freeze: 0, bomb: 0, laser: 0 },
    activePowerup: null,
    isFrozen: false,
    currentCombo: 0,

    addDrop: (row: number, col: number) => {
        const state = get();
        if (state.status !== 'playing' || state.isProcessing) return;
        if (state.dropsAvailable <= 0 && !state.isFrozen) return; // Allow if frozen (free move)

        const newDropsAvailable = state.isFrozen ? state.dropsAvailable : state.dropsAvailable - 1;

        let newGrid = state.grid.map(r => [...r]);
        newGrid[row][col] += 1;

        set({
            grid: newGrid,
            dropsAvailable: newDropsAvailable,
            isFrozen: false, // Consume freeze status
            currentCombo: 0 // Reset combo on new move
        });

        if (newGrid[row][col] > 3) {
            get().triggerChainReaction(row, col);
        } else {
            get().checkWinCondition();
        }
    },

    triggerChainReaction: (r: number, c: number) => {
        set({ isProcessing: true });
        const state = get();
        const newGrid = state.grid.map(row => [...row]);
        newGrid[r][c] = 0;
        set({ grid: newGrid });

        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // up, down, left, right
        const newProjectiles: Projectile[] = [];

        // Always create 4 projectiles in cardinal directions
        for (const [dr, dc] of directions) {
            const result = findTargetInDirection(newGrid, r, c, dr, dc);
            const [tr, tc] = result.target;
            newProjectiles.push({
                id: Math.random().toString(),
                start: [c, r],
                end: [tc, tr],
                targetPos: [tr, tc],
                hasTarget: result.hasTarget
            });
        }

        // Always have 4 projectiles now
        set(state => ({ projectiles: [...state.projectiles, ...newProjectiles] }));
        setTimeout(() => {
            get().resolveProjectiles(newProjectiles);
        }, 450); // Match 0.45s animation duration
    },

    resolveProjectiles: (completedProjectiles: Projectile[]) => {
        try {
            const state = get();
            const remaining = state.projectiles.filter(p => !completedProjectiles.some(cp => cp.id === p.id));
            set({ projectiles: remaining });

            let newGrid = state.grid.map(r => [...r]);
            let nextExplosions: [number, number][] = [];
            const newVisualExplosions: Explosion[] = [];

            // Only merge projectiles that have actual targets
            completedProjectiles.filter(p => p.hasTarget).forEach(p => {
                const [r, c] = p.targetPos;
                // Ensure we're within bounds (safety check)
                if (isValid(r, c)) {
                    newGrid[r][c] += 1;

                    // Add visual explosion at point of impact
                    newVisualExplosions.push({
                        id: Math.random().toString(),
                        position: [r, c]
                    });

                    if (newGrid[r][c] > 3) {
                        nextExplosions.push([r, c]);
                    }
                }
            });

            set(state => ({
                grid: newGrid,
                explosions: [...state.explosions, ...newVisualExplosions]
            }));

            // Auto-remove explosions after delay
            if (newVisualExplosions.length > 0) {
                setTimeout(() => {
                    set(state => ({
                        explosions: state.explosions.filter(e => !newVisualExplosions.some(ne => ne.id === e.id))
                    }));
                }, 1000);
            }

            if (nextExplosions.length > 0) {
                // Fix: Process ALL simultaneous explosions
                nextExplosions.forEach(([r, c]) => {
                    get().triggerChainReaction(r, c);
                });

                // Increment combo
                set(state => ({ currentCombo: state.currentCombo + nextExplosions.length }));
            } else {
                // No more explosions in this step
                get().checkWinCondition();
            }
        } catch (e) {
            console.error("Game loop error:", e);
            set({ isProcessing: false }); // Prevent lock
        }
    },

    checkWinCondition: () => {
        const state = get();
        const isEmpty = state.grid.every(r => r.every(c => c === 0));
        if (isEmpty) set({ status: 'won', isProcessing: false });
        else if (state.dropsAvailable <= 0) set({ status: 'lost', isProcessing: false });
        else set({ isProcessing: false });
    },

    resetGame: () => set(() => ({
        grid: Array(GRID_ROWS).fill(0).map(() =>
            Array(GRID_COLS).fill(0).map(() =>
                Math.random() > 0.9 ? 3 : (Math.random() > 0.8 ? 2 : 1)
            )
        ) as GridState,
        dropsAvailable: INITIAL_DROPS,
        status: 'playing',
        projectiles: [],
        explosions: [],
        isProcessing: false,
        powerups: { rain: 1, freeze: 0, bomb: 0, laser: 0 },
        activePowerup: null,
        isFrozen: false,
        currentCombo: 0,
    })),

    initializeLevel: (config: { dropsAvailable: number; emptyCells: number; redRatio: number; orangeRatio: number }, level: number) => {
        const totalCells = GRID_ROWS * GRID_COLS;
        const filledCells = totalCells - config.emptyCells;

        // Calculate how many of each type
        const redCount = Math.floor(filledCells * config.redRatio);
        const orangeCount = Math.floor(filledCells * config.orangeRatio);
        const tealCount = filledCells - redCount - orangeCount;

        // Create array of cell values
        const cells: CellValue[] = [
            ...Array(redCount).fill(3),
            ...Array(orangeCount).fill(2),
            ...Array(tealCount).fill(1),
            ...Array(config.emptyCells).fill(0),
        ] as CellValue[];

        // Shuffle using Fisher-Yates
        for (let i = cells.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cells[i], cells[j]] = [cells[j], cells[i]];
        }

        // Convert to 2D grid
        const grid: GridState = [];
        for (let r = 0; r < GRID_ROWS; r++) {
            grid.push(cells.slice(r * GRID_COLS, (r + 1) * GRID_COLS));
        }

        // Powerups unlock by level: rain=1, freeze=5, bomb=10, laser=15
        const powerups = {
            rain: 1,
            freeze: level >= 5 ? 1 : 0,
            bomb: level >= 10 ? 1 : 0,
            laser: level >= 15 ? 1 : 0,
        };

        set({
            grid,
            dropsAvailable: config.dropsAvailable,
            status: 'playing',
            projectiles: [],
            explosions: [],
            isProcessing: false,
            powerups,
            activePowerup: null,
            isFrozen: false,
            currentCombo: 0,
        });
    },

    // Powerup actions
    selectPowerup: (type: 'rain' | 'freeze' | 'bomb' | 'laser' | null) => set({ activePowerup: type }),

    useRainPowerup: (centerRow: number, centerCol: number) => {
        const state = get();
        if (state.status !== 'playing' || state.isProcessing) return;
        if (state.powerups.rain <= 0) return;

        // Deselect powerup and decrement count
        set(s => ({
            powerups: { ...s.powerups, rain: s.powerups.rain - 1 },
            activePowerup: null,
        }));

        // Apply rain to 3x3 grid centered on clicked cell
        let newGrid = state.grid.map(r => [...r]);
        const explosions: [number, number][] = [];

        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const r = centerRow + dr;
                const c = centerCol + dc;
                if (isValid(r, c)) {
                    newGrid[r][c] = Math.min(newGrid[r][c] + 1, 4) as CellValue;
                    if (newGrid[r][c] > 3) {
                        explosions.push([r, c]);
                    }
                }
            }
        }

        set({ grid: newGrid });

        // Trigger chain reactions if any
        if (explosions.length > 0) {
            get().triggerChainReaction(explosions[0][0], explosions[0][1]);
        } else {
            get().checkWinCondition();
        }
    },

    // Bomb: Clears 3x3 area completely
    useBombPowerup: (centerRow: number, centerCol: number) => {
        const state = get();
        if (state.status !== 'playing' || state.isProcessing) return;
        if (state.powerups.bomb <= 0) return;

        // Deselect powerup and decrement count
        set(s => ({
            powerups: { ...s.powerups, bomb: s.powerups.bomb - 1 },
            activePowerup: null,
        }));

        // Clear 3x3 grid centered on clicked cell
        let newGrid = state.grid.map(r => [...r]);
        const explosionsToTrigger: [number, number][] = [];

        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const r = centerRow + dr;
                const c = centerCol + dc;
                if (isValid(r, c) && newGrid[r][c] > 0) {
                    explosionsToTrigger.push([r, c]);
                    newGrid[r][c] = 0;
                }
            }
        }

        set({
            grid: newGrid,
            explosions: explosionsToTrigger.map(p => ({
                id: Math.random().toString(),
                position: p
            }))
        });

        // Check win condition after bomb
        setTimeout(() => {
            set({ explosions: [] });
            get().checkWinCondition();
        }, 500);
    },

    // Laser: Clears entire row or column
    useLaserPowerup: (row: number, col: number, direction: 'row' | 'col') => {
        const state = get();
        if (state.status !== 'playing' || state.isProcessing) return;
        if (state.powerups.laser <= 0) return;

        // Deselect powerup and decrement count
        set(s => ({
            powerups: { ...s.powerups, laser: s.powerups.laser - 1 },
            activePowerup: null,
        }));

        let newGrid = state.grid.map(r => [...r]);
        const explosionsToTrigger: [number, number][] = [];

        if (direction === 'row') {
            for (let c = 0; c < GRID_COLS; c++) {
                if (newGrid[row][c] > 0) {
                    explosionsToTrigger.push([row, c]);
                    newGrid[row][c] = 0;
                }
            }
        } else {
            for (let r = 0; r < GRID_ROWS; r++) {
                if (newGrid[r][col] > 0) {
                    explosionsToTrigger.push([r, col]);
                    newGrid[r][col] = 0;
                }
            }
        }

        set({
            grid: newGrid,
            explosions: explosionsToTrigger.map(p => ({
                id: Math.random().toString(),
                position: p
            }))
        });

        setTimeout(() => {
            set({ explosions: [] });
            get().checkWinCondition();
        }, 500);
    },

    // Freeze: Next click doesn't cost a drop
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

    unfreeze: () => {
        set({ isFrozen: false });
    }
}));

