import { useState } from 'react'
import './SearchBar.css'

type Props = {
  onSearch: (query: string) => void
  bgColorVar?: string
}

export default function SearchBar({ onSearch, bgColorVar = '--color-bg-light' }: Props) {
  const [value, setValue] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSearch(value.trim())
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div
        className="search-bg"
        style={{ background: `var(${bgColorVar})` }}
      >
        <img
          src="/src/assets/busca/Shape/Rectangle.png"
          alt=""
          className="search-bg-img search-bg-rectangle"
          aria-hidden="true"
        />
        <button type="submit" className="search-btn">
          <img src="/src/assets/busca/Lupa/Shape@1,5x.svg" alt="Buscar" className="search-icon" />
        </button>
        <input
          type="text"
          placeholder="Procure por heróis..."
          value={value}
          onChange={e => setValue(e.target.value)}
          className="search-input"
        />
      </div>
    </form>
  )
}
