import { useState } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { WaterDrop } from './WaterDrop'
import { useGameStore } from '../store/gameStore'

interface DropCellProps {
    row: number;
    col: number;
    position: [number, number, number];
}

export function DropCell({ row, col, position }: DropCellProps) {
    const addDrop = useGameStore(state => state.addDrop);
    // Granular subscription: Only re-render if THIS cell changes
    const value = useGameStore(state => state.grid[row][col]);

    const [hovered, setHover] = useState(false);

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        addDrop(row, col);
    }

    return (
        <group position={position}>
            {/* Hit target / Visual placeholder */}
            <mesh
                onClick={handleClick}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                visible={false} // Invisible hit box, or make it subtle?
            // Let's make it a subtle debug plane or purely invisible if we trust the drops?
            // But if empty, we need something to click.
            >
                <planeGeometry args={[0.9, 0.9]} />
                <meshBasicMaterial color="white" transparent opacity={0.1} />
            </mesh>

            {/* Visible marker for empty spots? The sketch shows dots or lines. 
          Let's add a subtle ring or mark if empty? 
          For now, just the hit plane (make it visible on hover?)
      */}
            <mesh
                position={[0, 0, -0.1]}
                visible={true} // Always show the slot
            >
                <ringGeometry args={[0.05, 0.08, 32]} />
                <meshBasicMaterial color={hovered ? "yellow" : "rgba(255,255,255,0.3)"} transparent opacity={hovered ? 0.8 : 0.4} />
            </mesh>

            {/* Render drops */}
            {value > 0 && (
                <WaterDrop level={value as 1 | 2 | 3} position={[0, 0, 0]} />
            )}
        </group>
    )
}
