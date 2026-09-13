import { useMemo, useState } from 'react'

export default function SearchBar({ members, onSelectMember }) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.trim().toLowerCase()
    return members.filter((m) => m.name.toLowerCase().includes(q)).slice(0, 8)
  }, [query, members])

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Tìm theo tên..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {results.length > 0 && (
        <ul className="search-results">
          {results.map((m) => (
            <li
              key={m.id}
              onClick={() => {
                onSelectMember(m.id)
                setQuery('')
              }}
            >
              {m.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
