import { useCallback, useEffect, useState } from 'react'
import { loadMembers, saveMembers } from '../utils/storage'
import { seedMembers } from '../utils/seedData'

function genId() {
  return `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export function useFamilyData() {
  const [members, setMembers] = useState(() => loadMembers() ?? seedMembers)

  useEffect(() => {
    saveMembers(members)
  }, [members])

  const addMember = useCallback((data) => {
    const newMember = {
      id: genId(),
      name: '',
      gender: '',
      birthDate: '',
      deathDate: '',
      occupation: '',
      bio: '',
      photo: '',
      parentIds: [],
      spouseIds: [],
      ...data,
    }
    setMembers((prev) => [...prev, newMember])
    return newMember.id
  }, [])

  const updateMember = useCallback((id, updates) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)))
  }, [])

  const deleteMember = useCallback((id) => {
    setMembers((prev) =>
      prev
        .filter((m) => m.id !== id)
        .map((m) => ({
          ...m,
          parentIds: m.parentIds.filter((pid) => pid !== id),
          spouseIds: m.spouseIds.filter((sid) => sid !== id),
        })),
    )
  }, [])

  const replaceAll = useCallback((newMembers) => {
    setMembers(newMembers)
  }, [])

  return { members, addMember, updateMember, deleteMember, replaceAll }
}
