import { GameScene } from './components/GameScene'
import { HUD } from './components/HUD'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <GameScene />
      <HUD />
    </div>
  )
}

export default App
