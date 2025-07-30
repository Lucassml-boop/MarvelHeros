import { useState } from 'react'
import './SearchBar.css'

type Props = {
  onSearch: (query: string) => void
  bgColorVar?: string
}

export default function SearchBar({ onSearch, bgColorVar = '--color-bg-light' }: Props) {
  const [value, setValue] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setValue(val)
    onSearch(val.trim())
  }

  return (
    <form className="search-bar" onSubmit={e => e.preventDefault()}>
      <div
        className="search-bg"
        data-bg={bgColorVar}
      >
        <img
          src="/assets/busca/Shape/Rectangle.png"
          alt=""
          className="search-bg-img search-bg-rectangle"
          aria-hidden="true"
        />
        <button type="submit" className="search-btn">
          <img src="/assets/busca/Lupa/Shape@1,5x.svg" alt="Buscar" className="search-icon" />
        </button>
        <input
          type="text"
          placeholder="Procure por heróis..."
          value={value}
          onChange={handleChange}
          className="search-input"
        />
      </div>
    </form>
  )
}
