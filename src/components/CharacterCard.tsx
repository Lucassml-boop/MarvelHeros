import { useState } from 'react'

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
  return (
    <div style={{
      borderRadius: 8,
      padding: 12,
      width: 180,
      height: 260,
      textAlign: 'center',
      background: '#fafafa',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start'
    }}>
      <div style={{
        width: '100%',
        height: 180,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 4px 0 #ff1510'
      }}>
        <img
          src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
          alt={character.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 8
      }}>
        <h3 style={{
          fontSize: 18,
          margin: 0,
          flex: 1,
          textAlign: 'left',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {character.name}
        </h3>
        <button
          onClick={onToggleFavorite}
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            marginLeft: 6,
            outline: 'none'
          }}
          aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <img
            src={
              favorite
                ? '/src/assets/icones/heart/Path Copy 7.svg'
                : '/src/assets/icones/heart/Path Copy 2@1,5x.svg'
            }
            alt={favorite ? 'Favorito' : 'Não favorito'}
            style={{
              width: 14,
              height: 14,
              transition: 'opacity 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1)'
            }}
          />
        </button>
      </div>
    </div>
  )
}
