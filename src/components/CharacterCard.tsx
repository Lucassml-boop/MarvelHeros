type Character = {
  id: number
  name: string
  thumbnail: {
    path: string
    extension: string
  }
}

export default function CharacterCard({ character }: { character: Character }) {
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: 8,
      padding: 12,
      width: 180,
      textAlign: 'center',
      background: '#fafafa'
    }}>
      <img
        src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
        alt={character.name}
        style={{ width: '100%', borderRadius: 4 }}
      />
      <h3 style={{ fontSize: 18, margin: '8px 0 0 0' }}>{character.name}</h3>
    </div>
  )
}
