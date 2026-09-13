import { useRef } from 'react'
import { exportToFile, parseImportedFile } from '../utils/storage'

export default function ImportExportControls({ members, onImport }) {
  const fileInputRef = useRef(null)

  function handleExport() {
    exportToFile(members)
  }

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = parseImportedFile(reader.result)
        const confirmed = window.confirm(
          `Nhập ${data.length} thành viên từ file. Thao tác này sẽ GHI ĐÈ toàn bộ dữ liệu hiện tại. Tiếp tục?`,
        )
        if (confirmed) onImport(data)
      } catch (err) {
        window.alert(`Lỗi khi nhập file: ${err.message}`)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="import-export-controls">
      <button className="btn" onClick={handleExport}>
        Xuất JSON
      </button>
      <button className="btn" onClick={handleImportClick}>
        Nhập JSON
      </button>
      <input
        type="file"
        accept="application/json"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  )
}
