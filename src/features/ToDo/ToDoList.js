import { useEffect } from 'react'
import { useAction, useAtom } from '@reatom/npm-react'

import { fetchList, toDoContentAtom, toDoVisibleIdsAtom } from './model'
import ToDoItem from './ToDoItem'

const ToDoList = () => {
  const [content] = useAtom(toDoContentAtom)
  const [visibleIds] = useAtom(toDoVisibleIdsAtom)
  const list = visibleIds.map((id) => ({ id, atom: content[id] }))

  const fetchListAction = useAction(fetchList)

  useEffect(() => {
    fetchListAction()
  }, [fetchListAction])

  return (
    <>
      <div className="row">
        <div className="col">
          {list.map(({ atom, id }) => (
            <ToDoItem atom={atom} key={id} />
          ))}
        </div>
      </div>
    </>
  )
}

export default ToDoList
