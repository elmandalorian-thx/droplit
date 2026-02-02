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

    // Actions
    addDrop: (row: number, col: number) => void;
    triggerChainReaction: (row: number, col: number) => void;
    resolveProjectiles: (projectiles: Projectile[]) => void;
    checkWinCondition: () => void;
    resetGame: () => void;
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

// Receiver helper: Find the first non-empty cell in a direction or return null
const findTargetInDirection = (grid: GridState, startRow: number, startCol: number, dRow: number, dCol: number): [number, number] | null => {
    let r = startRow + dRow;
    let c = startCol + dCol;

    while (isValid(r, c)) {
        if (grid[r][c] > 0) {
            return [r, c]; // Hit a drop!
        }
        r += dRow;
        c += dCol;
    }
    return null; // Hit wall
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

    addDrop: (row: number, col: number) => {
        const state = get();
        if (state.status !== 'playing' || state.isProcessing) return;
        if (state.dropsAvailable <= 0) return;

        const newDropsAvailable = state.dropsAvailable - 1;
        let newGrid = state.grid.map(r => [...r]);
        newGrid[row][col] += 1;

        set({ grid: newGrid, dropsAvailable: newDropsAvailable });

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

        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        const newProjectiles: Projectile[] = [];

        for (const [dr, dc] of directions) {
            const target = findTargetInDirection(newGrid, r, c, dr, dc);
            if (target) {
                const [tr, tc] = target;
                newProjectiles.push({
                    id: Math.random().toString(),
                    start: [c, r],
                    end: [tc, tr],
                    targetPos: [tr, tc]
                });
            }
        }

        if (newProjectiles.length > 0) {
            set(state => ({ projectiles: [...state.projectiles, ...newProjectiles] }));
            setTimeout(() => {
                get().resolveProjectiles(newProjectiles);
            }, 500);
        } else {
            set({ isProcessing: false });
            get().checkWinCondition();
        }
    },

    resolveProjectiles: (completedProjectiles: Projectile[]) => {
        const state = get();
        const remaining = state.projectiles.filter(p => !completedProjectiles.some(cp => cp.id === p.id));
        set({ projectiles: remaining });

        let newGrid = state.grid.map(r => [...r]);
        let nextExplosions: [number, number][] = [];
        const newVisualExplosions: Explosion[] = [];

        completedProjectiles.forEach(p => {
            const [r, c] = p.targetPos;
            newGrid[r][c] += 1;

            // Add visual explosion at point of impact
            newVisualExplosions.push({
                id: Math.random().toString(),
                position: [r, c]
            });

            if (newGrid[r][c] > 3) {
                nextExplosions.push([r, c]);
            }
        });

        set(state => ({
            grid: newGrid,
            explosions: [...state.explosions, ...newVisualExplosions]
        }));

        // Auto-remove explosions after delay (handled by component or here?)
        // Let's remove them here to keep state clean, but component needs time to render.
        // Let's set a timeout to remove them from state.
        if (newVisualExplosions.length > 0) {
            setTimeout(() => {
                set(state => ({
                    explosions: state.explosions.filter(e => !newVisualExplosions.some(ne => ne.id === e.id))
                }));
            }, 1000);
        }

        if (nextExplosions.length > 0) {
            // Only process the first explosion to keep chain reaction distinct/sequential?
            // Or loop? Let's loop but we need to match the async nature.
            // Actually, if we just call triggerChainReaction for the FIRST one, 
            // the others remain > 3 and will be processed later? 
            // No, `triggerChainReaction` logic relies on finding targets in the CURRENT grid.
            // If we have multiple explosions, we should ideally explode them all simultaneously.
            // But that's complex for the `projectiles` logic (directions might overlap?).

            // Let's explode the FIRST one. The others will be picked up? 
            // No, the system only recurses if we call it.
            // Simple approach: Pick first. 
            // Once that recursion finishes, we need to check if any others are ripe?
            // "Depth First".
            get().triggerChainReaction(nextExplosions[0][0], nextExplosions[0][1]);

            // NOTE: This misses other simultaneous explosions.
            // Ideally we'd modify triggerChainReaction to take a LIST of explosions.
            // For now, let's stick to simple Depth First. It matches the "Combo" feel.
        } else {
            set({ isProcessing: false });
            get().checkWinCondition();
        }
    },

    checkWinCondition: () => {
        const state = get();
        const isEmpty = state.grid.every(r => r.every(c => c === 0));
        if (isEmpty) set({ status: 'won' });
        else if (state.dropsAvailable <= 0) set({ status: 'lost' });
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
        isProcessing: false
    }))
}));
