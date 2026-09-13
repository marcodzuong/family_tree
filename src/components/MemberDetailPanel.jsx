export default function MemberDetailPanel({ member, members, onEdit, onClose }) {
  if (!member) return null

  const parents = members.filter((m) => member.parentIds.includes(m.id))
  const spouses = members.filter((m) => member.spouseIds.includes(m.id))
  const children = members.filter((m) => m.parentIds.includes(member.id))

  return (
    <div className="detail-panel">
      <button className="close-btn" onClick={onClose} aria-label="Đóng">
        ×
      </button>
      <div className="detail-photo">
        {member.photo ? (
          <img src={member.photo} alt={member.name} />
        ) : (
          <span className="member-photo-placeholder large">{member.name.charAt(0)}</span>
        )}
      </div>
      <h2>{member.name}</h2>
      {(member.birthDate || member.deathDate) && (
        <p className="detail-dates">
          {member.birthDate || '?'} – {member.deathDate || 'nay'}
        </p>
      )}
      {member.occupation && <p><strong>Nghề nghiệp:</strong> {member.occupation}</p>}
      {member.bio && <p className="detail-bio">{member.bio}</p>}

      {parents.length > 0 && (
        <p><strong>Cha/Mẹ:</strong> {parents.map((p) => p.name).join(', ')}</p>
      )}
      {spouses.length > 0 && (
        <p><strong>Vợ/Chồng:</strong> {spouses.map((s) => s.name).join(', ')}</p>
      )}
      {children.length > 0 && (
        <p><strong>Con cái:</strong> {children.map((c) => c.name).join(', ')}</p>
      )}

      <button className="btn btn-primary" onClick={() => onEdit(member.id)}>
        Sửa thông tin
      </button>
    </div>
  )
}
