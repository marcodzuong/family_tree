import { useMemo, useRef, useState, useEffect } from 'react'
import Tree from 'react-d3-tree'
import { buildFamilyTree } from '../utils/treeBuilder'
import MemberNode from './MemberNode'

export default function FamilyTreeView({ members, onSelectMember, onAddSpouse, onAddChild }) {
  const containerRef = useRef(null)
  const treeRef = useRef(null)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })

  const treeData = useMemo(() => buildFamilyTree(members), [members])

  useEffect(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect()
      setTranslate({ x: width / 2, y: 80 })
    }
  }, [])

  if (!treeData) {
    return (
      <div className="empty-tree" ref={containerRef}>
        Chưa có thành viên nào. Hãy thêm thành viên đầu tiên.
      </div>
    )
  }

  return (
    <div className="tree-container" ref={containerRef}>
      <Tree
        ref={treeRef}
        data={treeData}
        translate={translate}
        orientation="vertical"
        pathFunc="step"
        collapsible={true}
        zoomable={true}
        separation={{ siblings: 1.8, nonSiblings: 2.2 }}
        nodeSize={{ x: 320, y: 150 }}
        renderCustomNodeElement={(rd3tProps) => (
          <MemberNode
            {...rd3tProps}
            onNodeClick={onSelectMember}
            onAddSpouse={onAddSpouse}
            onAddChild={onAddChild}
          />
        )}
      />
    </div>
  )
}
