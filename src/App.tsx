import { useState, useEffect, useRef } from 'react'
import { GameContainer } from './components/GameContainer'
import { HUD } from './components/HUD'
import { WelcomeScreen } from './components/screens/WelcomeScreen'
import { LevelTransition } from './components/screens/LevelTransition'
import { LeaderboardScreen } from './components/screens/LeaderboardScreen'
import { WaterBackground } from './components/effects/WaterBackground'
import { useProfileStore } from './store/profileStore'
import { useLevelStore } from './store/levelStore'
import { useGameStore } from './store/gameStore'
import { soundManager } from './utils/SoundManager'

type GameScreen = 'welcome' | 'levelTransition' | 'playing' | 'leaderboard'

function App() {
  const [screen, setScreen] = useState<GameScreen>('welcome')
  const activeProfile = useProfileStore(state => state.getActiveProfile())
  const updateStats = useProfileStore(state => state.updateStats)
  const { currentLevel, levelConfig, advanceLevel, resetToLevel } = useLevelStore()
  const { status, initializeLevel, currentCombo, dropsAvailable } = useGameStore()
  const prevDropsRef = useRef(dropsAvailable)

  const handleStartGame = () => {
    if (activeProfile) {
      // Start from player's current level or level 1
      const startLevel = activeProfile.stats.currentLevel || 1
      resetToLevel(startLevel)
      setScreen('levelTransition')
    }
  }

  const handleContinueFromTransition = () => {
    // Initialize game with level config and current level for powerup unlocks
    initializeLevel(levelConfig, currentLevel)
    setScreen('playing')
  }

  const handleBackToMenu = () => {
    setScreen('welcome')
  }

  // Watch for level completion (win)
  useEffect(() => {
    if (status === 'won' && screen === 'playing') {
      // Update profile stats
      updateStats({
        highestLevel: Math.max(activeProfile?.stats.highestLevel || 0, currentLevel),
        currentLevel: currentLevel + 1,
        totalClears: (activeProfile?.stats.totalClears || 0) + 1,
        gamesPlayed: (activeProfile?.stats.gamesPlayed || 0) + 1,
      })

      // Advance to next level
      soundManager.playLevelUp()
      setTimeout(() => {
        advanceLevel()
        setScreen('levelTransition')
      }, 1500) // Brief delay to show "LEVEL CLEARED"
    }

    if (status === 'lost' && screen === 'playing') {
      soundManager.playGameOver()
      updateStats({
        gamesPlayed: (activeProfile?.stats.gamesPlayed || 0) + 1,
      })
    }
  }, [status])

  // Track drops used
  useEffect(() => {
    // Only count if playing and drops decreased (consumed)
    if (screen === 'playing' && dropsAvailable < prevDropsRef.current) {
      updateStats({
        totalDropsUsed: (activeProfile?.stats.totalDropsUsed || 0) + (prevDropsRef.current - dropsAvailable)
      })
    }
    prevDropsRef.current = dropsAvailable
  }, [dropsAvailable, screen])

  // Watch for best combo
  useEffect(() => {
    if (activeProfile && currentCombo > activeProfile.stats.bestCombo) {
      updateStats({ bestCombo: currentCombo })
    }
  }, [currentCombo])

  if (screen === 'welcome') {
    return (
      <WelcomeScreen
        onStartGame={handleStartGame}
        onShowLeaderboard={() => setScreen('leaderboard')}
      />
    )
  }

  if (screen === 'leaderboard') {
    return <LeaderboardScreen onBack={() => setScreen('welcome')} />
  }

  if (screen === 'levelTransition') {
    return (
      <LevelTransition
        config={levelConfig}
        onContinue={handleContinueFromTransition}
      />
    )
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <WaterBackground />
      <GameContainer />
      <HUD
        onBackToMenu={handleBackToMenu}
        playerName={activeProfile?.name}
        currentLevel={currentLevel}
      />
    </div>
  )
}

export default App



