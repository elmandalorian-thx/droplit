import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

interface Particle {
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    life: number;
}

export function ParticleSystem() {
    const [particles, setParticles] = useState<Particle[]>([]);
    const explosions = useGameStore(state => state.explosions);

    // Spawn particles when explosions occur
    useEffect(() => {
        if (explosions.length === 0) return;

        const newParticles: Particle[] = [];
        const cellSize = 50;
        const gap = 12;
        const gridOffset = { x: 50, y: 50 };

        explosions.forEach(exp => {
            const [row, col] = exp.position;
            const centerX = gridOffset.x + col * (cellSize + gap) + cellSize / 2;
            const centerY = gridOffset.y + row * (cellSize + gap) + cellSize / 2;

            // Spawn 8-12 particles per explosion
            const count = 8 + Math.floor(Math.random() * 5);
            for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
                const speed = 80 + Math.random() * 120;
                newParticles.push({
                    id: `${exp.id}-${i}`,
                    x: centerX,
                    y: centerY,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    color: ['#4facfe', '#a18cd1', '#ff6b6b'][Math.floor(Math.random() * 3)],
                    size: 6 + Math.random() * 8,
                    life: 1,
                });
            }
        });

        setParticles(prev => [...prev, ...newParticles]);
    }, [explosions]);

    // Physics update loop
    useEffect(() => {
        if (particles.length === 0) return;

        const interval = setInterval(() => {
            setParticles(prev => prev
                .map(p => ({
                    ...p,
                    x: p.x + p.vx * 0.016, // ~60fps delta
                    y: p.y + p.vy * 0.016,
                    vy: p.vy + 400 * 0.016, // Gravity
                    vx: p.vx * 0.98, // Air resistance
                    life: p.life - 0.02,
                }))
                .filter(p => p.life > 0)
            );
        }, 16);

        return () => clearInterval(interval);
    }, [particles.length]);

    return (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            <AnimatePresence>
                {particles.map(p => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 1, scale: 1 }}
                        animate={{ opacity: p.life, scale: p.life }}
                        exit={{ opacity: 0, scale: 0 }}
                        style={{
                            position: 'absolute',
                            left: p.x,
                            top: p.y,
                            width: p.size,
                            height: p.size,
                            borderRadius: '50%',
                            background: p.color,
                            boxShadow: `0 2px 8px ${p.color}88`,
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
