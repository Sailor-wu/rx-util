import { BaseNode, TreeBoxing } from './TreeBoxing'
import { excludeFieldsDeep } from './../obj/excludeFieldsDeep'

/**
 * @test {TreeBoxing}
 */
describe('test TreeBoxing', () => {
  const arr = [
    new BaseNode({ id: 1 }),
    new BaseNode({ id: 2, parentId: 1 }),
    new BaseNode({ id: 3, parentId: 1 }),
    new BaseNode({ id: 4, parentId: 2 }),
    new BaseNode({ id: 5, parentId: 2 }),
    new BaseNode({ id: 6, parentId: 5 }),
    new BaseNode({ id: 7, parentId: 3 }),
    new BaseNode({ id: 8, parentId: 7 })
  ]
  const root = {
    id: 1,
    child: [
      {
        id: 2,
        parentId: 1,
        child: [
          {
            id: 4,
            parentId: 2
          },
          {
            id: 5,
            parentId: 2,
            child: [
              {
                id: 6,
                parentId: 5
              }
            ]
          }
        ]
      },
      {
        id: 3,
        parentId: 1,
        child: [
          {
            id: 7,
            parentId: 3,
            child: [
              {
                id: 8,
                parentId: 7
              }
            ]
          }
        ]
      }
    ]
  }
  it('simple example', () => {
    const treeBoxing = TreeBoxing.fromList(arr)
    expect(treeBoxing.list).toIncludeSameMembers(arr)
    expect(excludeFieldsDeep(treeBoxing.toTree(), 'path')).toEqual(root)
    expect(treeBoxing.find(({ id }) => id === 4)).toEqual(treeBoxing.get(4))
    expect(treeBoxing.path(4, 6)).toIncludeSameMembers(['4', '2', '5', '6'])
    expect(treeBoxing.get(4).id).toBe(4)
    expect(treeBoxing.listByParentId(3)).toSatisfyAll(
      ({ parentId }) => parentId === 3
    )
  })
  it('test from tree', () => {
    const treeBoxing = TreeBoxing.fromTree(root)
    expect(
      excludeFieldsDeep(treeBoxing.list, 'path', 'child')
    ).toIncludeSameMembers(arr)
  })
  it('custom tree', () => {
    class CustomNode extends BaseNode {
      constructor ({ id, name, parent, children }) {
        super({ id, parentId: parent, child: children })
        this.id = id
        this.name = name
        this.parent = parent
        this.children = children
      }
      getParentId () {
        return this.parent
      }
      setParentId (parentId) {
        this.parent = parentId
      }
      getChild () {
        return this.children
      }
      setChild (child) {
        this.children = child
      }
    }
    const customNode = new CustomNode({
      id: 1,
      name: 'root',
      children: [new CustomNode({ id: 1, name: 'basic', parent: 1 })]
    })
    expect(customNode).toEqualCaseInsensitive({
      id: 1,
      name: 'root',
      parent: undefined,
      parentId: undefined,
      path: undefined,
      children: [
        {
          id: 1,
          name: 'basic',
          parent: 1,
          parentId: 1,
          child: undefined,
          children: undefined,
          path: undefined
        }
      ],
      child: [
        {
          id: 1,
          name: 'basic',
          parent: 1,
          parentId: 1,
          child: undefined,
          children: undefined,
          path: undefined
        }
      ]
    })
    // 测试 set 是否生效
    customNode.child = []
    console.log(customNode)
    expect(customNode.children).toIncludeSameMembers([])
  })
})
