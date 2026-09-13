import { useState } from 'react'

const emptyForm = {
  name: '',
  gender: '',
  birthDate: '',
  deathDate: '',
  occupation: '',
  bio: '',
  photo: '',
  parentIds: [],
  spouseIds: [],
  lineageRole: 'blood',
}

export default function MemberForm({
  members,
  initialData,
  spouseOfMember,
  childOfMembers,
  onSubmit,
  onCancel,
  onDelete,
}) {
  const [form, setForm] = useState(() => ({ ...emptyForm, ...initialData }))
  const isEditing = Boolean(initialData?.id)
  const hasRelationContext = Boolean(spouseOfMember) || Boolean(childOfMembers?.length)

  const otherMembers = members.filter((m) => m.id !== initialData?.id)

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => handleChange('photo', reader.result)
    reader.readAsDataURL(file)
  }

  function toggleMultiSelect(field, id) {
    setForm((prev) => {
      const current = prev[field]
      const adding = !current.includes(id)
      const next = adding ? [...current, id] : current.filter((x) => x !== id)
      const updated = { ...prev, [field]: next }

      // Gợi ý tự động vai trò huyết thống khi gán cha/mẹ hoặc vợ/chồng
      if (field === 'parentIds' && adding) {
        const parent = members.find((m) => m.id === id)
        if (parent?.lineageRole === 'blood') updated.lineageRole = 'blood'
      }
      if (field === 'spouseIds' && adding && prev.parentIds.length === 0) {
        updated.lineageRole = 'married-in'
      }
      return updated
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    onSubmit(form)
  }

  return (
    <form className="member-form" onSubmit={handleSubmit}>
      <h3>{isEditing ? 'Sửa thành viên' : 'Thêm thành viên'}</h3>

      <label>
        Họ tên <span className="required">*</span>
        <input
          type="text"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
      </label>

      <label>
        Quan hệ huyết thống với dòng họ
        <select
          value={form.lineageRole}
          onChange={(e) => handleChange('lineageRole', e.target.value)}
        >
          <option value="blood">Trực hệ (huyết thống)</option>
          <option value="married-in">Dâu / Rể (kết hôn vào)</option>
        </select>
        <p className="hint">
          Con cái sẽ tự động gợi ý là "Trực hệ" nếu cha/mẹ là trực hệ. Vợ/chồng mặc định là
          "Dâu/Rể" — bạn có thể chỉnh lại thủ công nếu cần.
        </p>
      </label>

      <label>
        Giới tính
        <select value={form.gender} onChange={(e) => handleChange('gender', e.target.value)}>
          <option value="">Không xác định</option>
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
        </select>
      </label>

      <div className="form-row">
        <label>
          Ngày sinh
          <input
            type="date"
            value={form.birthDate}
            onChange={(e) => handleChange('birthDate', e.target.value)}
          />
        </label>
        <label>
          Ngày mất
          <input
            type="date"
            value={form.deathDate}
            onChange={(e) => handleChange('deathDate', e.target.value)}
          />
        </label>
      </div>

      <label>
        Nghề nghiệp
        <input
          type="text"
          value={form.occupation}
          onChange={(e) => handleChange('occupation', e.target.value)}
        />
      </label>

      <label>
        Tiểu sử / Ghi chú
        <textarea
          rows={3}
          value={form.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
        />
      </label>

      <label>
        Ảnh đại diện
        <input type="file" accept="image/*" onChange={handlePhotoChange} />
        {form.photo && <img className="photo-preview" src={form.photo} alt="preview" />}
      </label>

      {spouseOfMember && (
        <p className="hint">
          Sẽ là vợ/chồng của <strong>{spouseOfMember.name}</strong>. Không cần điền cha/mẹ.
        </p>
      )}

      {childOfMembers?.length > 0 && (
        <p className="hint">
          Sẽ là con của{' '}
          <strong>{childOfMembers.map((p) => p.name).join(' & ')}</strong>. Không cần chọn
          vợ/chồng ở đây.
        </p>
      )}

      {!hasRelationContext && (
        <fieldset>
          <legend>Cha / Mẹ</legend>
          <div className="checkbox-list">
            {otherMembers.map((m) => (
              <label key={m.id} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={form.parentIds.includes(m.id)}
                  onChange={() => toggleMultiSelect('parentIds', m.id)}
                />
                {m.name}
              </label>
            ))}
            {otherMembers.length === 0 && <p className="hint">Chưa có thành viên khác.</p>}
          </div>
        </fieldset>
      )}

      {!hasRelationContext && (
        <fieldset>
          <legend>Vợ / Chồng</legend>
          <div className="checkbox-list">
            {otherMembers.map((m) => (
              <label key={m.id} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={form.spouseIds.includes(m.id)}
                  onChange={() => toggleMultiSelect('spouseIds', m.id)}
                />
                {m.name}
              </label>
            ))}
            {otherMembers.length === 0 && <p className="hint">Chưa có thành viên khác.</p>}
          </div>
        </fieldset>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Lưu' : 'Thêm'}
        </button>
        <button type="button" className="btn" onClick={onCancel}>
          Hủy
        </button>
        {isEditing && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onDelete(initialData.id)}
          >
            Xóa thành viên
          </button>
        )}
      </div>
    </form>
  )
}
