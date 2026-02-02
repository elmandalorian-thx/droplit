import { useGameStore, GRID_ROWS, GRID_COLS } from '../store/gameStore'
import { DropCell } from './DropCell'

export function Grid() {
    const grid = useGameStore(state => state.grid);

    // Center math
    // Spacing = 1.0
    const width = GRID_COLS;
    const height = GRID_ROWS;
    const offsetX = -(width - 1) / 2;
    const offsetY = -(height - 1) / 2;

    return (
        <group>
            {grid.map((row, rIndex) =>
                row.map((cellValue, cIndex) => (
                    <DropCell
                        key={`${rIndex}-${cIndex}`}
                        row={rIndex}
                        col={cIndex}
                        value={cellValue}
                        position={[offsetX + cIndex, offsetY + (GRID_ROWS - 1 - rIndex), 0]}
                    // Invert Y so row 0 is at top?
                    // Usually graphical Y is Up. Array row 0 is usually top.
                    // If offsetY centers 0..7, then row 0 should be at +Y.
                    // row 0 -> +Y, row 7 -> -Y.
                    />
                ))
            )}
        </group>
    )
}
