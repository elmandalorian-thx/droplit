import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { WaterDrop } from './WaterDrop'
import * as THREE from 'three'

interface ProjectileProps {
    start: [number, number]; // [col, row]
    end: [number, number];   // [col, row]
}

export function Projectile({ start, end }: ProjectileProps) {
    const group = useRef<THREE.Group>(null);
    const startTime = useRef(Date.now());
    const duration = 500; // ms

    useFrame(() => {
        if (!group.current) return;

        const now = Date.now();
        const progress = Math.min((now - startTime.current) / duration, 1);

        // Linear interpolation
        // Grid coords: x=col, y=-row (since we use row for Y but inverted visually in 3D usually? 
        // Wait, DropCell `position={[c, r, 0]}`? 
        // In Grid.tsx: `position={[c, r, 0]}`.
        // Wait, `r` increases down? 
        // If y=r, then increasing r moves UP in 3D (Y axis up).
        // Usually grid (0,0) is top-left.
        // If DropCell uses `position={[c, r, 0]}`, then (0,0) is origin. (0,1) is above.
        // If we want row 0 at top, we usually do `position={[c, -r, 0]}`.
        // Let's check Grid.tsx again.
        // `position={[-GRID_COLS / 2 + 0.5, -GRID_ROWS / 2 + 0.5, 0]}` -> Centering.
        // `position={[c, r, 0]}`.
        // So `r` is Y.
        // If `r` increases (row index increases), Y increases.
        // So row 0 is bottom?
        // Let's check standard array mapping.
        // `grid[row][col]`. 
        // If visual matches code, then row 0 is at Y=0. Row 7 is at Y=7.
        // So "Bottom" is row 0?
        // Usually "Top" is row 0.
        // I'll stick to what the code says. `start` and `end` are [col, row].
        // So x = start[0], y = start[1].

        const startX = start[0];
        const startY = start[1];
        const endX = end[0];
        const endY = end[1];

        group.current.position.x = THREE.MathUtils.lerp(startX, endX, progress);
        group.current.position.y = THREE.MathUtils.lerp(startY, endY, progress);

        // Optional arc height?
        // group.current.position.z = Math.sin(progress * Math.PI) * 0.5;
    });

    return (
        <group ref={group} position={[start[0], start[1], 0]}>
            <WaterDrop level={1} position={[0, 0, 0]} />
        </group>
    )
}
