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
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const PAGE_SIZE = 20

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('marvel_favorites') || '[]');
    setFavorites(favs);
  }, [])

  function fetchCharacters(query?: string, pageNum = 1) {
    setLoading(true)
    const ts = Date.now().toString()
    const hash = md5(ts + PRIVATE_KEY + PUBLIC_KEY)
    const offset = (pageNum - 1) * PAGE_SIZE
    axios
      .get(MARVEL_API, {
        params: {
          limit: PAGE_SIZE,
          offset,
          ts,
          apikey: PUBLIC_KEY,
          hash,
          ...(query ? { nameStartsWith: query } : {}),
        },
      })
      .then((res) => {
        setCharacters(res.data.data.results)
        setTotalPages(Math.ceil(res.data.data.total / PAGE_SIZE))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchCharacters(undefined, page)
  }, [page])

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

  function handleSearch(query: string) {
    setPage(1)
    fetchCharacters(query, 1)
  }

  return (
    <>
      <SearchBar onSearch={handleSearch} bgColorVar="--color-bg-light" />
      <div className="character-info-row">
        <span className="character-count">
          Encontrados {displayedCharacters.length} herois
        </span>
        <div className="character-order">
          <img
            src="/assets/icones/heroi/noun_Superhero_2227044@1,5x.svg"
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
                  ? '/assets/toggle/Group 6@1,5x.svg'
                  : '/assets/toggle/Group 2.svg' 
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
              src="/assets/icones/heart/Path Copy 7.svg"
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
        <>
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
          {/* Paginação */}
          {!showFavorites && (
            <div className="character-pagination">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="character-pagination-btn"
              >
                Anterior
              </button>
              <span className="character-pagination-info">
                Página {page} de {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="character-pagination-btn"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </>
  )
}
