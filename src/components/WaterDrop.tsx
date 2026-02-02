import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface WaterDropProps {
    level: 1 | 2 | 3;
    position: [number, number, number];
}

export function WaterDrop({ level, position }: WaterDropProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    // Animate wobble or pulse based on level?
    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();

        // Subtle breathing animation
        meshRef.current.position.y = position[1] + Math.sin(t * 2 + position[0]) * 0.05;

        // Slight rotation
        meshRef.current.rotation.x = Math.sin(t) * 0.1;
        meshRef.current.rotation.z = Math.cos(t) * 0.1;
    })

    // Colors based on level
    // 1: Blue, 2: Purple, 3: Red
    const color = level === 1 ? '#4facfe' : level === 2 ? '#a18cd1' : '#ff0844';
    const scale = level === 1 ? 0.4 : level === 2 ? 0.5 : 0.6;

    // Multiple drops logic:
    // If level > 1, we might want to render multiple spheres?
    // The sketch shows: 1 drop, 2 drops, 3 drops per cell.
    // "1 drop is color blue, 2 drops is purple, 3 drops is red".
    // The sketch shows them as single blobs (maybe larger?) or distinct abstract dots.
    // "2 drops is purple" -> Single purple dot in the sketch? 
    // Wait, the sketch shows:
    // Level 1: Blue dot.
    // Level 2: Purple dot.
    // Level 3: Red dot.
    // It seems like they change color and maybe size, rather than becoming 2 separate physical drops.
    // BUT the text says "1 drop... 2 drops...".
    // I will interpret it as: A single water mass that changes color/size. This is cleaner for 3D.

    return (
        <group position={position}>
            <mesh ref={meshRef} scale={scale}>
                <sphereGeometry args={[1, 32, 32]} />
                {/* State of the art transmission material */}
                <MeshTransmissionMaterial
                    backside
                    samples={4}
                    thickness={2}
                    chromaticAberration={0.06}
                    anisotropy={0.1}
                    distortion={0.5}
                    distortionScale={0.5}
                    temporalDistortion={0.5}
                    color={color}
                    resolution={256}
                />
            </mesh>
        </group>
    )
}
