import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import md5 from 'md5'
import { useRef } from 'react'
import './CharacterDetail.css'

const MARVEL_API = 'https://gateway.marvel.com/v1/public/characters'
const PUBLIC_KEY = import.meta.env.VITE_MARVEL_PUBLIC_KEY
const PRIVATE_KEY = import.meta.env.VITE_MARVEL_PRIVATE_KEY

const STAR_EMPTY = '/public/assets/review/Path Copy 6@1,5x.svg'
const STAR_FILLED = '/public/assets/review/Path@1,5x.svg'

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
  comics: {
    available: number
  }
  series: {
    available: number
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
  const [rating, setRating] = useState(0)

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
    const savedRating = Number(localStorage.getItem(`marvel_rating_${id}`) || 0)
    setRating(savedRating)
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

  function handleSetRating(value: number) {
    if (rating === value) {
      setRating(0)
      localStorage.removeItem(`marvel_rating_${id}`)
    } else {
      setRating(value)
      localStorage.setItem(`marvel_rating_${id}`, String(value))
    }
  }

  return (
    <>
      {character && (
        <div className="character-detail-bg-name">
          {character.name}
        </div>
      )}
      <div className="character-detail character-detail-container">
        <div className="character-detail-header">
          <img
            src="/public/assets/logo/Group@1,5x.svg"
            alt="Marvel Logo"
            className="character-detail-logo"
          />
          <div className="character-detail-search">
            <div className="character-detail-search-bg">
              <img
                src="/public/assets/busca/Shape/Rectangle@1,5x.svg"
                alt=""
                className="character-detail-search-bg-img"
                aria-hidden="true"
              />
              <input
                ref={searchRef}
                type="text"
                className="search-input character-detail-search-input"
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
              <img
                src="/public/assets/busca/Lupa/Shape@1,5x.svg"
                alt="Buscar"
                className="character-detail-search-icon"
              />
            </div>
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
                      className="search-dropdown-img"
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
                      ? '/public/assets/icones/heart/Path Copy 7.svg'
                      : '/public/assets/icones/heart/Path Copy 2@1,5x.svg'
                  }
                  alt={favorite ? 'Favorito' : 'Não favorito'}
                  className="character-card-fav-img"
                />
              </button>
            </div>
            <p
              className={
                !character.description || character.description.trim().length === 0
                  ? "character-detail-description character-detail-description-empty"
                  : "character-detail-description"
              }
            >
              {character.description && character.description.trim().length > 0
                ? character.description
                : 'Sem descrição disponível.'
              }
            </p>
            <div className="character-detail-info-row">
              <div className="character-detail-comics-info">
                <span className="character-detail-comics-label">Quadrinhos</span>
                <div className="character-detail-comics-row">
                  <img
                    src="/public/assets/icones/book/Group@1,5x.svg"
                    alt="Quadrinhos"
                    className="character-detail-comics-icon"
                  />
                  <span className="character-detail-comics-count">
                    {character.comics?.available ?? 0}
                  </span>
                </div>
                <div className="character-detail-rating">
                  Rating:
                  {[1, 2, 3, 4, 5].map(num => (
                    <img
                      key={num}
                      src={rating >= num ? STAR_FILLED : STAR_EMPTY}
                      alt={`Estrela ${num}`}
                      className="character-detail-rating-star"
                      onClick={() => handleSetRating(num)}
                    />
                  ))}
                </div>
                <div className="character-detail-last-comic">
                  Último quadrinho: {
                    comics.length > 0
                      ? (() => {
                          const date = comics[0].dates.find(d => d.type === 'onsaleDate')?.date;
                          return date ? new Date(date).toLocaleDateString() : '--';
                        })()
                      : '--'
                  }
                </div>
              </div>
              <div className="character-detail-movies-info">
                <span className="character-detail-movies-label">Séries</span>
                <div className="character-detail-movies-row">
                  <img
                    src="/public/assets/icones/video/Shape@1,5x.svg"
                    alt="Séries"
                    className="character-detail-movies-icon"
                  />
                  <span className="character-detail-movies-count">
                    {character.series?.available ?? 0}
                  </span>
                </div>
              </div>
            </div>
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
    </>
  );
}
