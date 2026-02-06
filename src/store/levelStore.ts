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
    // - Drops: generous early (70+), tightens steadily to force powerup use
    // - Empty cells: 0 for first few levels, ramps up significantly
    // - More red/orange at higher levels (harder to chain)

    // Drops: 10 at level 1, tightens to floor of 4
    const dropsAvailable = Math.max(4, Math.round(10 - (level - 1) * 0.3));

    // Empty cells: 0 for levels 1-3, then ramps up steadily
    // Level 1-3: 0, Level 5: ~2, Level 10: ~7, Level 20: ~16, Level 30+: caps at 24
    const emptyCells = level <= 3 ? 0 : Math.min(24, Math.floor((level - 3) * 0.8));

    // Color ratios - more reds/oranges at higher levels
    const redRatio = Math.min(0.35, 0.05 + level * 0.008);
    const orangeRatio = Math.min(0.40, 0.18 + level * 0.005);

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
