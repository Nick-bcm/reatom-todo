import { useEffect } from 'react'
import { useAction, useAtom } from '@reatom/npm-react'

import { toDoListAtom, fetchList } from './model'
import ToDoItem from './ToDoItem'
import AddToDoForm from './AddToDoForm'
import Filters from './Filters'

const ToDoList = () => {


  // TODO: вынести список в отдельный компонент

  // TODO: добавить отступы между компонентам

  const [list] = useAtom((ctx) =>
    ctx.spy(toDoListAtom).map((atom) => ({ atom, id: ctx.get(atom).id }))
  )
  const fetchListAction = useAction(fetchList)

  useEffect(() => {
    fetchListAction()
  }, [])

  return (
    <>
      <div className="row">
        <div className="col">
          <AddToDoForm />
        </div>
      </div>

      <div className="row">
        <div className="col">
          <Filters />
        </div>
      </div>

      <div className="row w-100">
        <div className="col-8 col-md-6 m-auto">
          {list.map(({ atom, id }) => (
            <ToDoItem atom={atom} key={id} />
          ))}
        </div>
      </div>
    </>
  )
}

export default ToDoList
