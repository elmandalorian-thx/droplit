import { create } from 'zustand';

export const GRID_ROWS = 8;
export const GRID_COLS = 6;
export const INITIAL_DROPS = 40;

export type CellValue = 0 | 1 | 2 | 3; // 0=empty, 1=blue, 2=purple, 3=red
// stored as flat array or 2D. Let's use 2D for easier coord math.
type GridState = CellValue[][];

type GameStatus = 'playing' | 'won' | 'lost';

interface GameState {
    grid: GridState;
    dropsAvailable: number;
    status: GameStatus;

    // Actions
    addDrop: (row: number, col: number) => void;
    resetGame: () => void;
}

// Helper to check if coord is valid
const isValid = (r: number, c: number) => r >= 0 && r < GRID_ROWS && c >= 0 && c < GRID_COLS;

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
const triggerExplosion = (grid: GridState, startRow: number, startCol: number) => {
    const newGrid = grid.map(row => [...row]);
    const queue: [number, number][] = [[startRow, startCol]];

    while (queue.length > 0) {
        const [r, c] = queue.shift()!;

        // Check if valid and needs explosion (Value > 3)
        if (newGrid[r][c] > 3) {
            newGrid[r][c] = 0; // Reset exploded cell

            const directions = [
                [-1, 0], // Up
                [1, 0],  // Down
                [0, -1], // Left
                [0, 1],  // Right
            ];

            for (const [dr, dc] of directions) {
                // Projectile logic: Travel until hit
                const target = findTargetInDirection(newGrid, r, c, dr, dc);

                if (target) {
                    const [tr, tc] = target;
                    newGrid[tr][tc] += 1;

                    // If this target is now critical, add to queue
                    if (newGrid[tr][tc] > 3) {
                        queue.push([tr, tc]);
                    }
                }
            }
        }
    }

    return newGrid;
};

export const useGameStore = create<GameState>((set) => ({
    grid: Array(GRID_ROWS).fill(0).map(() => Array(GRID_COLS).fill(0)), // Start empty or with random?
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

    dropsAvailable: INITIAL_DROPS,
    status: 'playing',

    addDrop: (row, col) => set((state) => {
        if (state.status !== 'playing') return state;
        if (state.dropsAvailable <= 0) return state;

        // 1. Consume drop
        const newDropsAvailable = state.dropsAvailable - 1;

        // 2. Add to target
        // We clone inside the triggerExplosion but here we assume single add first
        let newGrid = state.grid.map(r => [...r]);
        newGrid[row][col] += 1;

        // 3. Process explosions if needed
        if (newGrid[row][col] > 3) {
            newGrid = triggerExplosion(newGrid, row, col);
        }

        // 4. Check Win/Loss
        const isEmpty = newGrid.every(r => r.every(c => c === 0));
        let newStatus: GameStatus = 'playing';

        if (isEmpty) {
            newStatus = 'won';
        } else if (newDropsAvailable <= 0) {
            newStatus = 'lost';
        }

        return {
            grid: newGrid,
            dropsAvailable: newDropsAvailable,
            status: newStatus
        };
    }),

    resetGame: () => set(() => ({
        // Reset to a default level (randomized for replayability)
        grid: Array(GRID_ROWS).fill(0).map(() =>
            Array(GRID_COLS).fill(0).map(() =>
                Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0
            )
        ) as GridState,
        dropsAvailable: INITIAL_DROPS,
        status: 'playing'
    }))
}));
