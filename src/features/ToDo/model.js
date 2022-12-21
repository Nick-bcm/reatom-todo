import { atom, action } from '@reatom/core'
import _ from 'lodash'

export const VISIBILITY_FILTERS = {
  ALL: 'all',
  COMPLETED: 'completed',
  INCOMPLETE: 'incomplete',
}

export const filterAtom = atom(VISIBILITY_FILTERS.ALL, 'activeFilter')
export const setFilter = action(
  (ctx, event) => filterAtom(ctx, event.currentTarget.value),
  'setFilter'
)

// TODO: переделать на список id с content

export const inputAtom = atom('', 'inputAtom')
export const onInput = action(
  (ctx, event) => inputAtom(ctx, event.currentTarget.value),
  'onInput'
)

const data = [
  { id: 1, title: '123', isDone: false },
  { id: 2, title: 'qwe', isDone: true },
  { id: 3, title: 'asd', isDone: false },
]

const api = {
  getList: () =>
    new Promise((resolve, reject) => {
      setTimeout(() => resolve(data), 1000)
    }),
  patchItem: (item) =>
    new Promise((resolve, reject) => {
      setTimeout(() => resolve(item), 1000)
    }),
  deleteItem: (id) =>
    new Promise((resolve, reject) => {
      setTimeout(() => resolve(true), 1000)
    }),
  createItem: (title) =>
    new Promise((resolve, reject) => {
      setTimeout(
        () => resolve({ title, isDone: false, id: Math.ceil(Math.random() * 1000) }),
        1000
      )
    }),
}

export const toDoListAtom = atom([], 'toDoList')
export const fetchList = action(
  (ctx) =>
    ctx.schedule(async () => {
      const toDoListDto = await api.getList()
      const list = toDoListDto.map(({ id, title, isDone }) =>
        atom({ id, title, isDone: atom(isDone, 'toDoItem.isDone') }, 'toDoItem')
      )
      toDoListAtom(ctx, list)
    }),
  'fetchList'
)

export const createToDoItem = action(
  (ctx, payload) =>
    ctx.schedule(async () => {
      const { id, title, isDone } = await api.createItem(payload)
      const newToDo = atom(
        { id, title, isDone: atom(isDone, 'toDoItem.isDone') },
        'toDoItem'
      )
      toDoListAtom(ctx, (list) => [newToDo, ...list])
      inputAtom(ctx, '')
    }),
  'createToDoItem'
)

export const saveToDoItem = action(
  (ctx, payload) =>
    ctx.schedule(async () => {
      const { id, title, isDone } = await api.patchItem(payload)
      const itemToUpdate = _.find(
        ctx.get(toDoListAtom),
        (atom) => ctx.get(atom).id === id
      )
      ctx.get(itemToUpdate).isDone(ctx, isDone)
    }),
  'saveToDoItem'
)

export const deleteToDoItem = action(
  (ctx, itemId) =>
    ctx.schedule(async () => {
      const response = await api.deleteItem(itemId)
      if (response) {
        const list = ctx.get(toDoListAtom).filter((toDoItemAtom) => {
          const { id } = ctx.get(toDoItemAtom)
          return id !== itemId
        })
        toDoListAtom(ctx, list)
      }
    }),
  'deleteToDoItem'
)
