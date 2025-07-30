import { Link } from 'react-router-dom'
import './CharacterCard.css'

type Character = {
  id: number
  name: string
  thumbnail: {
    path: string
    extension: string
  }
}

type Props = {
  character: Character
  favorite: boolean
  onToggleFavorite: () => void
}

export default function CharacterCard({ character, favorite, onToggleFavorite }: Props) {
  function handleFavoriteClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (favorite) {
      const favs = JSON.parse(localStorage.getItem('marvel_favorites') || '[]');
      const newFavs = favs.filter((favId: number) => favId !== character.id);
      localStorage.setItem('marvel_favorites', JSON.stringify(newFavs));
    }
    onToggleFavorite();
  }

  return (
    <div className="character-card">
      <Link to={`/character/${character.id}`} className="character-card-link">
        <div className="character-card-img-container">
          <img
            src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
            alt={character.name}
            className="character-card-img"
          />
        </div>
        <div className="character-card-row">
          <h3 className="character-card-name">
            {character.name}
          </h3>
          <button
            onClick={handleFavoriteClick}
            className="character-card-fav-btn"
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
      </Link>
    </div>
  )
}
