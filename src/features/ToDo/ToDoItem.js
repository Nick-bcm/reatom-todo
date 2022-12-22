import { useAction, useAtom } from '@reatom/npm-react'

import { saveToDoItem, deleteToDoItem } from './model'

const ToDoItem = ({ atom }) => {
  const [{ id, title, isDone }] = useAtom(atom)
  const [isDoneToDo] = useAtom(isDone)

  const handleChange = useAction(saveToDoItem)
  const handleDelete = useAction(deleteToDoItem)

  return (
    <div className="row g-0">
      <div className="col-auto">
        <button
          type="button"
          className="btn btn-default"
          onClick={() => handleChange({ id, isDone: !isDoneToDo })}
        >
          <i
            className={`bi text-white ${isDoneToDo ? 'bi-check-square' : 'bi-square'}`}
          />
        </button>
      </div>

      <div className="col text-start text-break">{title}</div>

      <div className="col-auto">
        <button
          type="button"
          className="btn btn-default"
          onClick={() => handleDelete(id)}
        >
          <i className="bi bi-trash text-white" />
        </button>
      </div>
    </div>
  )
}

export default ToDoItem
