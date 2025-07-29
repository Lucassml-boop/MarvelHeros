import './App.css'
import Header from './components/header/Header'
import CharacterList from './components/characters/CharacterList'
import Footer from './components/footer/Footer'

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={{ flex: 1 }}>
        <CharacterList />
      </div>
      <Footer />
    </div>
  )
}

export default App
