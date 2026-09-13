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

  const selectedMember = members.find((m) => m.id === selectedId) || null
  const editingMember = formMode === 'edit' ? selectedMember : null

  function handleSelectMember(id) {
    setSelectedId(id)
    setFormMode(null)
  }

  function handleAddClick() {
    setSelectedId(null)
    setFormMode('add')
  }

  function handleEditClick(id) {
    setSelectedId(id)
    setFormMode('edit')
  }

  function handleFormSubmit(data) {
    if (formMode === 'edit' && editingMember) {
      updateMember(editingMember.id, data)
      setSelectedId(editingMember.id)
    } else {
      const newId = addMember(data)
      setSelectedId(newId)
    }
    setFormMode(null)
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
  }

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
        <FamilyTreeView members={members} onSelectMember={handleSelectMember} />

        {formMode && (
          <div className="side-panel">
            <MemberForm
              members={members}
              initialData={editingMember}
              onSubmit={handleFormSubmit}
              onCancel={() => setFormMode(null)}
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
