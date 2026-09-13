const CARD_WIDTH = 210
const CONNECTOR_WIDTH = 26

function PersonCard({ person, onClick, showAddSpouse, onAddSpouse }) {
  return (
    <div
      className="member-card"
      data-gender={person.gender || 'unknown'}
      data-lineage={person.lineageRole || 'blood'}
      onClick={onClick}
    >
      {showAddSpouse && (
        <button
          type="button"
          className="add-spouse-btn"
          title="Thêm vợ/chồng"
          onClick={(e) => {
            e.stopPropagation()
            onAddSpouse(person.id)
          }}
        >
          +
        </button>
      )}
      <div className="member-photo">
        {person.photo ? (
          <img src={person.photo} alt={person.name} />
        ) : (
          <span className="member-photo-placeholder">{person.name?.charAt(0) || '?'}</span>
        )}
      </div>
      <div className="member-info">
        <div className="member-name">
          {person.name}
          {person.lineageRole === 'married-in' && (
            <span className="married-in-badge" title="Dâu/Rể">
              ⚭
            </span>
          )}
        </div>
        {(person.birthDate || person.deathDate) && (
          <div className="member-dates">
            {person.birthDate || '?'} – {person.deathDate || ''}
          </div>
        )}
      </div>
    </div>
  )
}

export default function MemberNode({ nodeDatum, onNodeClick, onAddSpouse }) {
  const isVirtualRoot = nodeDatum.memberId == null

  if (isVirtualRoot) {
    return (
      <g>
        <circle r={4} fill="#999" />
        <text fill="#999" x={10} y={5} style={{ fontSize: 12 }}>
          {nodeDatum.name}
        </text>
      </g>
    )
  }

  const spouses = nodeDatum.spouses || []
  const totalWidth = CARD_WIDTH + spouses.length * (CARD_WIDTH + CONNECTOR_WIDTH)

  return (
    <g>
      <foreignObject width={totalWidth} height={90} x={-20} y={-30}>
        <div className="couple-group">
          <PersonCard
            person={{
              id: nodeDatum.memberId,
              name: nodeDatum.name,
              photo: nodeDatum.photo,
              gender: nodeDatum.gender,
              lineageRole: nodeDatum.lineageRole,
              birthDate: nodeDatum.birthDate,
              deathDate: nodeDatum.deathDate,
            }}
            onClick={() => onNodeClick(nodeDatum.memberId)}
            showAddSpouse
            onAddSpouse={onAddSpouse}
          />
          {spouses.map((s) => (
            <div className="couple-pair" key={s.id}>
              <span className="couple-connector">⚭</span>
              <PersonCard person={s} onClick={() => onNodeClick(s.id)} />
            </div>
          ))}
        </div>
      </foreignObject>
    </g>
  )
}
