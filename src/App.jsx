import { useState } from 'react'
import { useFamilyData } from './hooks/useFamilyData'
import FamilyTreeView from './components/FamilyTreeView'
import MemberDetailPanel from './components/MemberDetailPanel'
import MemberForm from './components/MemberForm'
import SearchBar from './components/SearchBar'
import ImportExportControls from './components/ImportExportControls'

export default function App() {
  const { members, addMember, updateMember, deleteMember, replaceAll } = useFamilyData()
  const [selectedId, setSelectedId] = useState(null)
  const [formMode, setFormMode] = useState(null) // null | 'add' | 'edit'
  const [addSpouseOfId, setAddSpouseOfId] = useState(null)

  const selectedMember = members.find((m) => m.id === selectedId) || null
  const editingMember = formMode === 'edit' ? selectedMember : null
  const spouseOfMember = members.find((m) => m.id === addSpouseOfId) || null

  function handleSelectMember(id) {
    setSelectedId(id)
    setFormMode(null)
    setAddSpouseOfId(null)
  }

  function handleAddClick() {
    setSelectedId(null)
    setAddSpouseOfId(null)
    setFormMode('add')
  }

  function handleAddSpouseClick(memberId) {
    setSelectedId(null)
    setAddSpouseOfId(memberId)
    setFormMode('add')
  }

  function handleEditClick(id) {
    setSelectedId(id)
    setAddSpouseOfId(null)
    setFormMode('edit')
  }

  function handleFormSubmit(data) {
    if (formMode === 'edit' && editingMember) {
      updateMember(editingMember.id, data)
      setSelectedId(editingMember.id)
    } else {
      const newId = addMember(data)
      if (spouseOfMember) {
        updateMember(spouseOfMember.id, { spouseIds: [...spouseOfMember.spouseIds, newId] })
      }
      setSelectedId(newId)
    }
    setFormMode(null)
    setAddSpouseOfId(null)
  }

  function handleDelete(id) {
    const confirmed = window.confirm('Bạn có chắc muốn xóa thành viên này?')
    if (!confirmed) return
    deleteMember(id)
    setSelectedId(null)
    setFormMode(null)
  }

  function handleImport(data) {
    replaceAll(data)
    setSelectedId(null)
    setFormMode(null)
    setAddSpouseOfId(null)
  }

  const addFormPrefill = spouseOfMember
    ? { spouseIds: [spouseOfMember.id], lineageRole: 'married-in' }
    : null

  return (
    <div className="app">
      <header className="app-header">
        <h1>Cây Gia Phả</h1>
        <SearchBar members={members} onSelectMember={handleSelectMember} />
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleAddClick}>
            + Thêm thành viên
          </button>
          <ImportExportControls members={members} onImport={handleImport} />
        </div>
      </header>

      <main className="app-main">
        <FamilyTreeView
          members={members}
          onSelectMember={handleSelectMember}
          onAddSpouse={handleAddSpouseClick}
        />

        {formMode && (
          <div className="side-panel">
            <MemberForm
              members={members}
              initialData={formMode === 'edit' ? editingMember : addFormPrefill}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setFormMode(null)
                setAddSpouseOfId(null)
              }}
              onDelete={handleDelete}
            />
          </div>
        )}

        {!formMode && selectedMember && (
          <div className="side-panel">
            <MemberDetailPanel
              member={selectedMember}
              members={members}
              onEdit={handleEditClick}
              onClose={() => setSelectedId(null)}
            />
          </div>
        )}
      </main>

      <footer className="app-footer">
        {members.length} thành viên · Dữ liệu được lưu tự động trên trình duyệt (localStorage)
      </footer>
    </div>
  )
}
