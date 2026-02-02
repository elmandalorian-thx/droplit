import { useMemo } from 'react';

interface BlobbyAvatarProps {
    seed: number;
    color: string;
    size?: number;
    className?: string;
}

// Generate a procedural blob shape using SVG path
function generateBlobPath(seed: number): string {
    // Use seed to generate pseudo-random values
    const random = (index: number) => {
        const x = Math.sin(seed + index * 12.9898) * 43758.5453;
        return x - Math.floor(x);
    };

    // Generate 6-8 control points around a circle with variations
    const numPoints = 6 + Math.floor(random(0) * 3);
    const points: { x: number; y: number }[] = [];

    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const radiusVariation = 0.7 + random(i + 1) * 0.5; // 0.7 to 1.2
        const x = 50 + Math.cos(angle) * 35 * radiusVariation;
        const y = 50 + Math.sin(angle) * 35 * radiusVariation;
        points.push({ x, y });
    }

    // Create smooth bezier curve through points
    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length; i++) {
        const p0 = points[(i - 1 + points.length) % points.length];
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];
        const p3 = points[(i + 2) % points.length];

        // Catmull-Rom to Bezier conversion
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    path += ' Z';
    return path;
}

export function BlobbyAvatar({ seed, color, size = 48, className = '' }: BlobbyAvatarProps) {
    const blobPath = useMemo(() => generateBlobPath(seed), [seed]);

    // Generate a lighter shade for the highlight
    const lighterColor = useMemo(() => {
        // Simple way to lighten: mix with white
        return `${color}80`;
    }, [color]);

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className={className}
            style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
        >
            <defs>
                <radialGradient id={`blob-grad-${seed}`} cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor={lighterColor} />
                    <stop offset="100%" stopColor={color} />
                </radialGradient>
            </defs>

            {/* Main blob shape */}
            <path
                d={blobPath}
                fill={`url(#blob-grad-${seed})`}
                style={{
                    animation: 'blob-wobble 3s ease-in-out infinite',
                }}
            />

            {/* Highlight spot */}
            <ellipse
                cx="38"
                cy="35"
                rx="8"
                ry="6"
                fill="rgba(255,255,255,0.4)"
                style={{ transform: 'rotate(-20deg)', transformOrigin: '38px 35px' }}
            />
        </svg>
    );
}

// CSS animation for the blob (add to global styles)
export const blobWobbleCSS = `
@keyframes blob-wobble {
    0%, 100% { transform: scale(1) rotate(0deg); }
    25% { transform: scale(1.02) rotate(1deg); }
    50% { transform: scale(0.98) rotate(-1deg); }
    75% { transform: scale(1.01) rotate(0.5deg); }
}
`;
