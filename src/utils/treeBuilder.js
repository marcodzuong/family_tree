// Chuyển danh sách thành viên phẳng (flat list) sang cấu trúc cây lồng nhau
// cho react-d3-tree. Vì mỗi người có thể có 2 cha/mẹ nhưng cây chỉ có 1 gốc,
// ta chọn root là những người không có parentIds (thế hệ đầu tiên),
// và mỗi node hiển thị kèm vợ/chồng ngay bên cạnh (spouses), con cái là children.
//
// Vợ/chồng của một người KHÔNG được dựng thành node/nhánh riêng — họ chỉ được
// gộp hiển thị trong cùng 1 thẻ với người đó (mảng `spouses`), và con cái của
// cặp đôi được gom theo cả 2 người, để tránh 2 vợ chồng bị tách ra 2 nhánh xa nhau.

function buildNode(member, membersById, visited) {
  if (visited.has(member.id)) return null
  visited.add(member.id)

  const spouseMembers = member.spouseIds
    .map((sid) => membersById.get(sid))
    .filter(Boolean)
  // Đánh dấu vợ/chồng đã "dùng" để họ không bị dựng thành root/nhánh riêng biệt
  spouseMembers.forEach((s) => visited.add(s.id))

  const allMembers = membersById.get('__all__')
  const parentIdsInCouple = [member.id, ...spouseMembers.map((s) => s.id)]
  const childIds = new Set(
    allMembers
      .filter((m) => m.parentIds.some((pid) => parentIdsInCouple.includes(pid)))
      .map((m) => m.id),
  )

  const children = [...childIds]
    .map((cid) => membersById.get(cid))
    .filter(Boolean)
    .map((child) => buildNode(child, membersById, visited))
    .filter(Boolean)

  const spouses = spouseMembers.map((s) => ({
    id: s.id,
    name: s.name,
    photo: s.photo,
    gender: s.gender,
    lineageRole: s.lineageRole,
  }))

  return {
    name: member.name,
    attributes: {
      id: member.id,
    },
    memberId: member.id,
    photo: member.photo,
    gender: member.gender,
    birthDate: member.birthDate,
    deathDate: member.deathDate,
    lineageRole: member.lineageRole,
    spouses,
    children: children.length > 0 ? children : undefined,
  }
}

export function buildFamilyTree(members) {
  if (!members || members.length === 0) return null

  const membersById = new Map(members.map((m) => [m.id, m]))
  membersById.set('__all__', members)

  const roots = members.filter((m) => m.parentIds.length === 0)
  const visited = new Set()

  const rootNodes = roots
    .map((r) => buildNode(r, membersById, visited))
    .filter(Boolean)

  // Thêm những người bị bỏ sót (vd. do quan hệ vòng lặp / dữ liệu lỗi) như root phụ
  const orphans = members
    .filter((m) => !visited.has(m.id))
    .map((m) => buildNode(m, membersById, visited))
    .filter(Boolean)

  const allRoots = [...rootNodes, ...orphans]

  if (allRoots.length === 0) return null
  if (allRoots.length === 1) return allRoots[0]

  // react-d3-tree cần 1 root duy nhất -> bọc trong 1 node ảo "Gia phả"
  return {
    name: 'Gia phả',
    attributes: {},
    memberId: null,
    children: allRoots,
  }
}
