import { useState } from 'react'
import { GameContainer } from './components/GameContainer'
import { HUD } from './components/HUD'
import { WelcomeScreen } from './components/screens/WelcomeScreen'
import { useProfileStore } from './store/profileStore'

type GameScreen = 'welcome' | 'playing'

function App() {
  const [screen, setScreen] = useState<GameScreen>('welcome')
  const activeProfile = useProfileStore(state => state.getActiveProfile())

  const handleStartGame = () => {
    if (activeProfile) {
      setScreen('playing')
    }
  }

  const handleBackToMenu = () => {
    setScreen('welcome')
  }

  if (screen === 'welcome') {
    return <WelcomeScreen onStartGame={handleStartGame} />
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <GameContainer />
      <HUD onBackToMenu={handleBackToMenu} playerName={activeProfile?.name} />
    </div>
  )
}

export default App


