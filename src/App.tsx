import { useState, useEffect, useRef, useCallback } from 'react'
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
  const status = useGameStore(state => state.status)
  const initializeLevel = useGameStore(state => state.initializeLevel)
  const currentCombo = useGameStore(state => state.currentCombo)
  const dropsAvailable = useGameStore(state => state.dropsAvailable)
  const prevDropsRef = useRef(dropsAvailable)

  // Use refs for values accessed inside effects to avoid stale closures
  const activeProfileRef = useRef(activeProfile)
  const currentLevelRef = useRef(currentLevel)
  const screenRef = useRef(screen)
  activeProfileRef.current = activeProfile
  currentLevelRef.current = currentLevel
  screenRef.current = screen

  const handleStartGame = useCallback(() => {
    if (activeProfile) {
      const startLevel = activeProfile.stats.currentLevel || 1
      resetToLevel(startLevel)
      setScreen('levelTransition')
    }
  }, [activeProfile, resetToLevel])

  const handleContinueFromTransition = useCallback(() => {
    initializeLevel(levelConfig, currentLevel)
    setScreen('playing')
  }, [initializeLevel, levelConfig, currentLevel])

  const handleBackToMenu = useCallback(() => {
    setScreen('welcome')
  }, [])

  // Watch for level completion
  useEffect(() => {
    const profile = activeProfileRef.current
    const level = currentLevelRef.current

    if (status === 'won' && screenRef.current === 'playing') {
      updateStats({
        highestLevel: Math.max(profile?.stats.highestLevel || 0, level),
        currentLevel: level + 1,
        totalClears: (profile?.stats.totalClears || 0) + 1,
        gamesPlayed: (profile?.stats.gamesPlayed || 0) + 1,
      })

      soundManager.playLevelUp()
      setTimeout(() => {
        advanceLevel()
        setScreen('levelTransition')
      }, 1500)
    }

    if (status === 'lost' && screenRef.current === 'playing') {
      soundManager.playGameOver()
      updateStats({
        gamesPlayed: (activeProfileRef.current?.stats.gamesPlayed || 0) + 1,
      })
    }
  }, [status, updateStats, advanceLevel])

  // Track drops used
  useEffect(() => {
    if (screenRef.current === 'playing' && dropsAvailable < prevDropsRef.current) {
      const profile = activeProfileRef.current
      updateStats({
        totalDropsUsed: (profile?.stats.totalDropsUsed || 0) + (prevDropsRef.current - dropsAvailable)
      })
    }
    prevDropsRef.current = dropsAvailable
  }, [dropsAvailable, updateStats])

  // Watch for best combo
  useEffect(() => {
    const profile = activeProfileRef.current
    if (profile && currentCombo > profile.stats.bestCombo) {
      updateStats({ bestCombo: currentCombo })
    }
  }, [currentCombo, updateStats])

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
