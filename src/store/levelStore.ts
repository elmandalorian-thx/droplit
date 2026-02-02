import { create } from 'zustand';

export interface LevelConfig {
    level: number;
    dropsAvailable: number;
    emptyCells: number;
    redRatio: number;     // Ratio of red (3) cells
    orangeRatio: number;  // Ratio of orange (2) cells
    // Remaining are teal (1) cells
}

interface LevelState {
    currentLevel: number;
    levelConfig: LevelConfig;

    // Actions
    generateLevel: (level: number) => LevelConfig;
    advanceLevel: () => void;
    resetToLevel: (level: number) => void;
}

// Generate level configuration based on level number
export function generateLevelConfig(level: number): LevelConfig {
    // Difficulty curve:
    // - Drops decrease as level increases
    // - More empty cells at higher levels
    // - More red/orange at higher levels

    const dropsAvailable = Math.max(20, 55 - Math.floor(level * 0.7));
    const emptyCells = Math.min(20, Math.floor(level / 3));

    // Color ratios increase with level
    const redRatio = Math.min(0.35, 0.08 + level * 0.006);
    const orangeRatio = Math.min(0.40, 0.20 + level * 0.004);

    return {
        level,
        dropsAvailable,
        emptyCells,
        redRatio,
        orangeRatio,
    };
}

// Generate initial grid based on level config
export function generateGridForLevel(config: LevelConfig, rows: number, cols: number): number[][] {
    const totalCells = rows * cols;
    const filledCells = totalCells - config.emptyCells;

    // Calculate how many of each type
    const redCount = Math.floor(filledCells * config.redRatio);
    const orangeCount = Math.floor(filledCells * config.orangeRatio);
    const tealCount = filledCells - redCount - orangeCount;

    // Create array of cell values
    const cells: number[] = [
        ...Array(redCount).fill(3),
        ...Array(orangeCount).fill(2),
        ...Array(tealCount).fill(1),
        ...Array(config.emptyCells).fill(0),
    ];

    // Shuffle using Fisher-Yates
    for (let i = cells.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cells[i], cells[j]] = [cells[j], cells[i]];
    }

    // Convert to 2D grid
    const grid: number[][] = [];
    for (let r = 0; r < rows; r++) {
        grid.push(cells.slice(r * cols, (r + 1) * cols));
    }

    return grid;
}

export const useLevelStore = create<LevelState>((set, get) => ({
    currentLevel: 1,
    levelConfig: generateLevelConfig(1),

    generateLevel: (level: number) => {
        const config = generateLevelConfig(level);
        set({ currentLevel: level, levelConfig: config });
        return config;
    },

    advanceLevel: () => {
        const nextLevel = get().currentLevel + 1;
        const config = generateLevelConfig(nextLevel);
        set({ currentLevel: nextLevel, levelConfig: config });
    },

    resetToLevel: (level: number) => {
        const config = generateLevelConfig(level);
        set({ currentLevel: level, levelConfig: config });
    },
}));
