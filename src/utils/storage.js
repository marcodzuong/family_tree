const STORAGE_KEY = 'family-tree-data'

export function loadMembers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

export function saveMembers(members) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members))
}

export function exportToFile(members) {
  const blob = new Blob([JSON.stringify(members, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const date = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `family-tree-${date}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function isValidMember(m) {
  return (
    m &&
    typeof m === 'object' &&
    typeof m.id === 'string' &&
    typeof m.name === 'string' &&
    Array.isArray(m.parentIds) &&
    Array.isArray(m.spouseIds)
  )
}

export function parseImportedFile(fileText) {
  const data = JSON.parse(fileText)
  if (!Array.isArray(data)) {
    throw new Error('File JSON không hợp lệ: dữ liệu phải là một mảng thành viên.')
  }
  if (!data.every(isValidMember)) {
    throw new Error('File JSON không hợp lệ: thiếu trường bắt buộc (id, name, parentIds, spouseIds).')
  }
  return data
}
