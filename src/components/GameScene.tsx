import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Background } from './Background'
import { Grid } from './Grid'

export function GameScene() {
    return (
        <Canvas
            camera={{ position: [0, 0, 10], fov: 45 }}
            dpr={[1, 2]} // Support high DPI
            gl={{ antialias: true, toneMappingExposure: 1.2 }}
        >
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <directionalLight position={[-5, 5, 5]} intensity={1} castShadow />

            {/* Environment for reflections (Crucial for water/glass looks) */}
            <Environment preset="forest" blur={0.8} />

            <Background />
            <Grid />

            {/* Optional: OrbitControls for debug, but locked for game? */}
            {/* <OrbitControls /> */}
            {/* Let's keep it fixed for the puzzle gameplay, maybe slight parallax later */}
        </Canvas>
    )
}
