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

  function handleAddSpouseClick(e) {
    e.stopPropagation()
    onAddSpouse(nodeDatum.memberId)
  }

  return (
    <g>
      <foreignObject width={220} height={90} x={-20} y={-30}>
        <div
          className="member-card"
          data-gender={nodeDatum.gender || 'unknown'}
          data-lineage={nodeDatum.lineageRole || 'blood'}
          onClick={() => onNodeClick(nodeDatum.memberId)}
        >
          <button
            type="button"
            className="add-spouse-btn"
            title="Thêm vợ/chồng"
            onClick={handleAddSpouseClick}
          >
            +
          </button>
          <div className="member-photo">
            {nodeDatum.photo ? (
              <img src={nodeDatum.photo} alt={nodeDatum.name} />
            ) : (
              <span className="member-photo-placeholder">
                {nodeDatum.name?.charAt(0) || '?'}
              </span>
            )}
          </div>
          <div className="member-info">
            <div className="member-name">
              {nodeDatum.name}
              {nodeDatum.lineageRole === 'married-in' && (
                <span className="married-in-badge" title="Dâu/Rể">
                  ⚭
                </span>
              )}
            </div>
            {(nodeDatum.birthDate || nodeDatum.deathDate) && (
              <div className="member-dates">
                {nodeDatum.birthDate || '?'} – {nodeDatum.deathDate || ''}
              </div>
            )}
            {spouses.length > 0 && (
              <div className="member-spouses">
                ⚭{' '}
                {spouses.map((s, i) => (
                  <span key={s.id}>
                    {i > 0 && ', '}
                    <span
                      className="spouse-link"
                      onClick={(e) => {
                        e.stopPropagation()
                        onNodeClick(s.id)
                      }}
                    >
                      {s.name}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </foreignObject>
    </g>
  )
}
