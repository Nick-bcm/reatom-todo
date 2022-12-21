import { useState } from 'react'
import {
  atom,
  reatomAsync,
  withAbort,
  withDataAtom,
  withRetryAction,
  onUpdate,
  sleep,
} from '@reatom/framework'
import { useAction, useAtom } from '@reatom/npm-react'

import { onInput, inputAtom, createToDoItem } from './model'

const AddToDoForm = ({}) => {
  const [input] = useAtom(inputAtom)
  const handleInput = useAction(onInput)
  const handleCreate = useAction(createToDoItem)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const input = e.currentTarget.querySelector('input')
        handleCreate(input.value)
      }}
    >
      <div className="row">
        <div className="col-8">
          <input
            value={input}
            type="text"
            className="form-control"
            name="title"
            onChange={handleInput}
          />
        </div>

        <div className="col-4">
          <button type="submit" className="btn btn-success">
            <i className="bi bi-plus-lg" />
          </button>
        </div>
      </div>
    </form>
  )
}

export default AddToDoForm
