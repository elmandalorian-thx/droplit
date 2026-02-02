import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ExplosionProps {
    // position not needed, handled by parent group
}

export function Explosion({ }: ExplosionProps) {
    const group = useRef<THREE.Group>(null);
    const particles = useMemo(() => {
        return Array.from({ length: 8 }).map(() => ({
            velocity: [
                (Math.random() - 0.5) * 0.1, // x
                (Math.random() - 0.5) * 0.1, // y
                (Math.random() * 0.1)        // z (up)
            ],
            scale: Math.random() * 0.5 + 0.5,
            offset: [0, 0, 0]
        }));
    }, []);

    // [col, row] conversion for 3D position
    // Matches Grid.tsx: X = col, Y = (ROWS - 1 - row)
    // Wait, let's verify Grid.tsx logic: array index `r` maps to `offsetY + (GRID_ROWS - 1 - r)`.
    // We should use the same logic or pass standard position.
    // For simplicity, let's just duplicate the math here or pass calculated World Pos.
    // In store: position is [row, col].

    // Grid Props needed?
    // Let's hardcode for now based on known grid layout or better:
    // Move this logic to GameScene where we iterate and place them safely.
    // But inside this component, we animate.

    useFrame(() => {
        if (!group.current) return;

        group.current.children.forEach((child, i) => {
            const p = particles[i];

            // Physics
            child.position.x += p.velocity[0];
            child.position.y += p.velocity[1];
            child.position.z += p.velocity[2];

            // Gravity
            p.velocity[2] -= 0.005;

            // Fade out scale
            child.scale.multiplyScalar(0.9);
        });
    });

    return (
        <group ref={group}>
            {particles.map((_, i) => (
                <mesh key={i} position={[0, 0, 0]}>
                    <sphereGeometry args={[0.08, 8, 8]} />
                    <meshStandardMaterial color="#aaf" emissive="#00f" emissiveIntensity={0.5} transparent opacity={0.8} />
                </mesh>
            ))}
        </group>
    )
}
