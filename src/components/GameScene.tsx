import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Background } from './Background'
import { Grid } from './Grid'
import { Projectile } from './Projectile'
import { Explosion } from './Explosion'
import { useGameStore, GRID_ROWS, GRID_COLS } from '../store/gameStore'
import { useEffect } from 'react'

const playPop = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400 + Math.random() * 200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
        // Ignore
    }
};

export function GameScene() {
    const projectiles = useGameStore(state => state.projectiles);
    const explosions = useGameStore(state => state.explosions);

    useEffect(() => {
        if (explosions.length > 0) {
            playPop();
        }
    }, [explosions]);

    // Center math
    const width = GRID_COLS;
    const height = GRID_ROWS;
    const offsetX = -(width - 1) / 2;
    const offsetY = -(height - 1) / 2;

    return (
        <Canvas
            camera={{ position: [0, 0, 10], fov: 45 }}
            dpr={[1, 2]}
            gl={{ antialias: true, toneMappingExposure: 1.2 }}
        >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <directionalLight position={[-5, 5, 5]} intensity={1} castShadow />

            <Environment preset="forest" blur={0.8} />

            <Background />
            <Grid />

            {projectiles.map(p => (
                <Projectile key={p.id} start={p.start} end={p.end} />
            ))}

            {explosions.map(e => (
                <group
                    key={e.id}
                    position={[
                        offsetX + e.position[1],
                        offsetY + (GRID_ROWS - 1 - e.position[0]),
                        0.5
                    ]}
                >
                    <Explosion />
                </group>
            ))}

            {/* <OrbitControls /> */}
        </Canvas>
    )
}
