import { GRID_ROWS, GRID_COLS } from '../store/gameStore'
import { DropCell } from './DropCell'

export function Grid() {
    // Center math
    // Spacing = 1.0
    const width = GRID_COLS;
    const height = GRID_ROWS;
    const offsetX = -(width - 1) / 2;
    const offsetY = -(height - 1) / 2;

    const slots = Array.from({ length: GRID_ROWS }, (_, r) =>
        Array.from({ length: GRID_COLS }, (_, c) => ({ r, c }))
    ).flat();

    return (
        <group>
            {slots.map(({ r, c }) => (
                <DropCell
                    key={`${r}-${c}`}
                    row={r}
                    col={c}
                    position={[offsetX + c, offsetY + (GRID_ROWS - 1 - r), 0]}
                />
            ))}
        </group>
    )
}
