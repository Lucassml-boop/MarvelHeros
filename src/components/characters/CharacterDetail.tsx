import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import md5 from 'md5'
import { useRef } from 'react'
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
  const [searchResults, setSearchResults] = useState<Character[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { id } = useParams<{ id: string }>()
  const [character, setCharacter] = useState<Character | null>(null)
  const [comics, setComics] = useState<Comic[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const ts = Date.now().toString();
      const hash = md5(ts + PRIVATE_KEY + PUBLIC_KEY);
      try {
        const charRes = await axios.get(`${MARVEL_API}/${id}`, {
          params: { ts, apikey: PUBLIC_KEY, hash }
        });
        setCharacter(charRes.data.data.results[0]);
        const comicsRes = await axios.get(`${MARVEL_API}/${id}/comics`, {
          params: {
            ts,
            apikey: PUBLIC_KEY,
            hash,
            orderBy: '-onsaleDate',
            limit: 10
          }
        });
        setComics(comicsRes.data.data.results);
      } catch {
        setCharacter(null);
        setComics([]);
      }
      setLoading(false);
    }
    fetchData();
    const favs = JSON.parse(localStorage.getItem('marvel_favorites') || '[]');
    setFavorite(favs.includes(Number(id)));
  }, [id]);
  const [favorite, setFavorite] = useState(false)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchResults([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  if (loading) return <p>Carregando...</p>
  if (!character) return <p>Personagem não encontrado.</p>

  function toggleFavorite() {
    if (!character) return;
    setFavorite((prev) => {
      const favs = JSON.parse(localStorage.getItem('marvel_favorites') || '[]');
      let newFavs;
      if (prev) {
        newFavs = favs.filter((favId: number) => favId !== character.id);
      } else {
        if (favs.length >= 5) {
          alert('Você só pode favoritar até 5 personagens.');
          return prev;
        }
        newFavs = [...favs, character.id];
      }
      localStorage.setItem('marvel_favorites', JSON.stringify(newFavs));
      return !prev;
    });
  }

  return (
    <div className="character-detail character-detail-container">
      <div className="character-detail-header">
        <img
          src="/src/assets/logo/Group@1,5x.svg"
          alt="Marvel Logo"
          className="character-detail-logo"
        />
        <div className="character-detail-search">
          <button className="search-btn" tabIndex={-1} style={{ background: 'transparent', border: 'none', padding: 0, marginRight: 8 }}>
            <img src="/src/assets/busca/Lupa/Shape@1,5x.svg" alt="Buscar" className="search-icon" />
          </button>
          <input
            ref={searchRef}
            type="text"
            className="search-input"
            placeholder="Procure por heróis..."
            onChange={async (e) => {
              const value = e.target.value;
              if (!value) {
                setSearchResults([]);
                return;
              }
              setSearchLoading(true);
              const ts = Date.now().toString();
              const hash = md5(ts + PRIVATE_KEY + PUBLIC_KEY);
              try {
                const res = await axios.get(MARVEL_API, {
                  params: {
                    nameStartsWith: value,
                    limit: 5,
                    ts,
                    apikey: PUBLIC_KEY,
                    hash,
                  },
                });
                setSearchResults(res.data.data.results);
              } catch {
                setSearchResults([]);
              }
              setSearchLoading(false);
            }}
            autoComplete="off"
            onKeyDown={e => {
              if (e.key === 'Escape') setSearchResults([]);
            }}
          />
          {(searchLoading || searchResults.length > 0) && (
            <div
              className="search-dropdown"
              ref={dropdownRef}
            >
              {searchLoading ? 'Carregando...' : searchResults.map((char) => (
                <a
                  key={char.id}
                  href={`/character/${char.id}`}
                  className="search-dropdown-item"
                >
                  <img
                    src={`${char.thumbnail.path}.${char.thumbnail.extension}`}
                    alt={char.name}
                    style={{ width: 32, height: 32, borderRadius: 4, marginRight: 8 }}
                  />
                  {char.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="character-detail-main">
        <img
          src={
            (() => {
              const path = character.thumbnail.path;
              const ext = character.thumbnail.extension;
              if (path.includes('transparent') || path.includes('portrait_uncanny')) {
                return `${path}.${ext}`;
              }
              return `${path}.${ext}`;
            })()
          }
          alt={character.name}
          className="character-detail-image"
        />
        <div>
          <div className="character-detail-title-row">
            <h2 className="character-detail-title">{character.name}</h2>
            <button
              className="character-card-fav-btn"
              onClick={toggleFavorite}
              aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <img
                src={
                  favorite
                    ? '/src/assets/icones/heart/Path Copy 7.svg'
                    : '/src/assets/icones/heart/Path Copy 2@1,5x.svg'
                }
                alt={favorite ? 'Favorito' : 'Não favorito'}
                className="character-card-fav-img"
              />
            </button>
          </div>
          <p className="character-detail-description">{character.description || 'Sem descrição.'}</p>
        </div>
      </div>
      <h3 className="character-detail-comics-title">Últimos quadrinhos lançados</h3>
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
  );
}
