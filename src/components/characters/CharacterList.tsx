import { useEffect, useState } from 'react'
import axios from 'axios'
import md5 from 'md5'
import CharacterCard from './CharacterCard'
import SearchBar from '../search/SearchBar'
import './CharacterList.css'

const MARVEL_API = 'https://gateway.marvel.com/v1/public/characters'
const PUBLIC_KEY = import.meta.env.VITE_MARVEL_PUBLIC_KEY
const PRIVATE_KEY = import.meta.env.VITE_MARVEL_PRIVATE_KEY

type Character = {
  id: number
  name: string
  thumbnail: {
    path: string
    extension: string
  }
}

export default function CharacterList() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [orderAZ, setOrderAZ] = useState(true) // Começa com A-Z
  const [showFavorites, setShowFavorites] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('marvel_favorites') || '[]');
    setFavorites(favs);
  }, [])
  function fetchCharacters(query?: string) {
    setLoading(true)
    const ts = Date.now().toString()
    const hash = md5(ts + PRIVATE_KEY + PUBLIC_KEY)
    axios
      .get(MARVEL_API, {
        params: {
          limit: 20,
          ts,
          apikey: PUBLIC_KEY,
          hash,
          ...(query ? { nameStartsWith: query } : {}),
        },
      })
      .then((res) => {
        setCharacters(res.data.data.results)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchCharacters()
  }, [])

  // Ordenação dos personagens por nome A-Z ou Z-A
  const sortedCharacters = [...characters].sort((a, b) =>
    orderAZ ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  )

  // Filtra personagens favoritos
  const favoriteCharacters = sortedCharacters.filter(char => favorites.includes(char.id))
  const displayedCharacters = showFavorites ? favoriteCharacters : sortedCharacters

  function toggleFavorite(id: number) {
    setFavorites(favs => {
      if (favs.includes(id)) {
        return favs.filter(favId => favId !== id)
      } else {
        if (favs.length >= 5) {
          alert('Você só pode favoritar até 5 personagens.')
          return favs
        }
        return [...favs, id]
      }
    })
  }

  return (
    <>
      <SearchBar onSearch={fetchCharacters} bgColorVar="--color-bg-light" />
      <div className="character-info-row">
        <span className="character-count">
          Encontrados {displayedCharacters.length} herois
        </span>
        <div className="character-order">
          <img
            src="/public/assets/icones/heroi/noun_Superhero_2227044@1,5x.svg"
            alt="Herói"
            className="character-order-icon"
          />
          <span className="character-order-text">
            Ordernar por nome - {orderAZ ? 'A/Z' : 'Z/A'}
          </span>
          <button
            className="character-order-toggle"
            onClick={() => setOrderAZ((prev) => !prev)}
            aria-label="Toggle order A/Z"
            tabIndex={0}
          >
            <img
              src={
                orderAZ
                  ? '/public/assets/toggle/Group 6@1,5x.svg'
                  : '/public/assets/toggle/Group 2.svg' 
              }
              alt={orderAZ ? 'Ordenação A/Z ativada' : 'Ordenação Z/A ativada'}
              className="character-order-toggle-img"
            />
          </button>
          <button
            className="character-favorite-toggle"
            onClick={() => setShowFavorites((prev) => !prev)}
            aria-label="Filtrar favoritos"
            tabIndex={0}
          >
            <img
              src="/public/assets/icones/heart/Path Copy 7.svg"
              alt="Filtrar favoritos"
              className="character-favorite-toggle-img"
            />
          </button>
          <span className="character-favorite-label">
            somente favoritos
          </span>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="character-list-cards-container">
          {displayedCharacters.length === 0 && showFavorites
            ? null
            : displayedCharacters.map((char) => (
                <CharacterCard
                  key={char.id}
                  character={char}
                  favorite={favorites.includes(char.id)}
                  onToggleFavorite={() => toggleFavorite(char.id)}
                />
              ))}
        </div>
      )}
    </>
  )
}
