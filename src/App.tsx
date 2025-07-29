import './App.css'
import Header from './components/header/Header'
import CharacterList from './components/characters/CharacterList'
import CharacterDetail from './components/characters/CharacterDetail'
import Footer from './components/footer/Footer'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

function AppContent() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {isHome && <Header />}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<CharacterList />} />
          <Route path="/character/:id" element={<CharacterDetail />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
