// Chuyển danh sách thành viên phẳng (flat list) sang cấu trúc cây lồng nhau
// cho react-d3-tree. Vì mỗi người có thể có 2 cha/mẹ nhưng cây chỉ có 1 gốc,
// ta chọn root là những người không có parentIds (thế hệ đầu tiên),
// và mỗi node hiển thị kèm vợ/chồng ngay bên cạnh (spouses), con cái là children.

function buildNode(member, membersById, visited) {
  if (visited.has(member.id)) return null
  visited.add(member.id)

  const children = membersById
    .get('__all__')
    .filter((m) => m.parentIds.includes(member.id))
    .map((child) => buildNode(child, membersById, visited))
    .filter(Boolean)

  const spouses = member.spouseIds
    .map((sid) => membersById.get(sid))
    .filter(Boolean)
    .map((s) => ({ id: s.id, name: s.name, photo: s.photo, gender: s.gender }))

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

  const rootNodes = roots.map((r) => buildNode(r, membersById, visited)).filter(Boolean)

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
