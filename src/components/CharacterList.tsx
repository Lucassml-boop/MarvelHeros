import { useEffect, useState } from 'react'
import axios from 'axios'
import md5 from 'md5'
import CharacterCard from './CharacterCard'
import SearchBar from './SearchBar'

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

  return (
    <>
      <SearchBar onSearch={fetchCharacters} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {characters.map((char) => (
            <CharacterCard key={char.id} character={char} />
          ))}
        </div>
      )}
    </>
  )
}
