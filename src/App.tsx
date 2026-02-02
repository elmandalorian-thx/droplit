import { GameContainer } from './components/GameContainer'
import { HUD } from './components/HUD'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <GameContainer />
      <HUD />
    </div>
  )
}

export default App

