# Claude AI Development Log - DropLit

## Project Overview
**DropLit** is a mobile-first puzzle game where players tap colorful drops that merge and explode in chain reactions. Built with React, TypeScript, and Framer Motion for smooth 2D animations.

## Live Demo
🎮 **[Play DropLit](https://droplit-black.vercel.app/)**

---

## Architecture

### Tech Stack
- **React 18** + **TypeScript** - Core framework
- **Vite** - Build tool
- **Framer Motion** - 2D animations with spring physics
- **Zustand** - State management
- **SVG Filters** - Gooey/morphing visual effects

### Key Components
| Component | Purpose |
|-----------|---------|
| `GameContainer.tsx` | Main 2D game view with CSS Grid layout |
| `Cell2D.tsx` | Individual drop cells with wobble animations |
| `Projectile2D.tsx` | Animated projectiles flying between cells |
| `gameStore.ts` | Zustand store with game logic |

### Design Decisions
1. **2D over 3D** - Switched from Three.js to Framer Motion for better mobile performance
2. **SVG Goo Filter** - Creates smooth morphing effect when drops merge
3. **Spring Physics** - Natural, jelly-like wobble animations on interaction
4. **Mobile-First** - Responsive grid that scales to any screen size

---

## Recent Changes

### Feb 2026 - 2D Refactor & Visual Polish
- Migrated from 3D WebGL to 2D canvas
- Implemented gooey SVG filter for lava lamp drop merging
- Added Framer Motion for spring animations
- Removed broken particle system
- **Fixed projectile mechanics** - now originate from exact cell center
- **Premium 3D CSS styling** - glass highlights, multi-layer shadows, depth effects
- **Lava lamp effect** - drops morph and merge fluidly
- Red projectiles morph to blue during flight (0.7s animation)
- **Powerups system** - Rain powerup adds 1 drop to 3x3 grid area (3 uses per game)
- Frosted glass powerup bar at bottom with selection glow

---

## Commands

```bash
# Development
npm install
npm run dev

# Build
npm run build

# Deploy to Vercel
npx vercel --prod
```

---

## File Structure
```
src/
├── components/
│   ├── GameContainer.tsx  # Main game container
│   ├── Cell2D.tsx         # Drop cells with animations
│   ├── Projectile2D.tsx   # Flying projectile animations
│   └── GameContainer.css  # Grid layout styles
├── store/
│   └── gameStore.ts       # Game state & logic
└── App.tsx                # Entry point
```
