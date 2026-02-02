import { useRef } from 'react'
import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Background() {
    const texture = useTexture('/leaf.png')
    const meshRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        if (!meshRef.current) return
        // Subtle float
        meshRef.current.position.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 - 2 // Background slightly behind
    })

    return (
        <mesh ref={meshRef} position={[0, 0, -2]} scale={[20, 20, 1]}>
            <planeGeometry />
            <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
    )
}
