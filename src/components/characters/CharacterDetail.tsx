import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import md5 from 'md5'
import SearchBar from '../search/SearchBar'
import './CharacterDetail.css'

const MARVEL_API = 'https://gateway.marvel.com/v1/public/characters'
const PUBLIC_KEY = import.meta.env.VITE_MARVEL_PUBLIC_KEY
const PRIVATE_KEY = import.meta.env.VITE_MARVEL_PRIVATE_KEY

type Comic = {
  id: number
  title: string
  thumbnail: {
    path: string
    extension: string
  }
  dates: { type: string; date: string }[]
}

type Character = {
  id: number
  name: string
  description: string
  thumbnail: {
    path: string
    extension: string
  }
}

export default function CharacterDetail() {
  const { id } = useParams<{ id: string }>()
  const [character, setCharacter] = useState<Character | null>(null)
  const [comics, setComics] = useState<Comic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const ts = Date.now().toString()
      const hash = md5(ts + PRIVATE_KEY + PUBLIC_KEY)
      const charRes = await axios.get(`${MARVEL_API}/${id}`, {
        params: { ts, apikey: PUBLIC_KEY, hash }
      })
      setCharacter(charRes.data.data.results[0])
      const comicsRes = await axios.get(`${MARVEL_API}/${id}/comics`, {
        params: {
          ts,
          apikey: PUBLIC_KEY,
          hash,
          orderBy: '-onsaleDate',
          limit: 10
        }
      })
      setComics(comicsRes.data.data.results)
      setLoading(false)
    }
    fetchData()
  }, [id])

  if (loading) return <p>Carregando...</p>
  if (!character) return <p>Personagem não encontrado.</p>

  return (
    <div className="character-detail-container">
      <div className="character-detail-header">
        <img
          src="/src/assets/logo/Group@1,5x.svg"
          alt="Marvel Logo"
          className="character-detail-logo"
        />
        <div className="character-detail-search">
          <SearchBar onSearch={() => {}} bgColorVar="--color-bg-light" />
        </div>
      </div>
      <Link to="/" className="character-detail-back">← Voltar</Link>
      <div className="character-detail-main">
        <img
          src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
          alt={character.name}
          className="character-detail-image"
        />
        <div>
          <h2 className="character-detail-title">{character.name}</h2>
          <p className="character-detail-description">{character.description || 'Sem descrição.'}</p>
        </div>
      </div>
      <h3 className="character-detail-comics-title">Últimos 10 quadrinhos lançados</h3>
      <div className="character-detail-comics-list">
        {comics.map(comic => (
          <div key={comic.id} className="character-detail-comic-card">
            <img
              src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
              alt={comic.title}
              className="character-detail-comic-image"
            />
            <div className="character-detail-comic-title">{comic.title}</div>
            <div className="character-detail-comic-date">
              {comic.dates.find(d => d.type === 'onsaleDate')?.date
                ? new Date(comic.dates.find(d => d.type === 'onsaleDate')!.date).toLocaleDateString()
                : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
