import { atom, action } from '@reatom/core'

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

const createToDoItemAtom = ({ id, title, isDone }) => (
  atom({ id, title, isDone: atom(isDone, 'toDoItem.isDone') }, 'toDoItem')
)

export const toDoContentAtom = atom({}, 'toDoContent')

export const toDoIdsAtom = atom((ctx) => {
  const toDoContent = ctx.spy(toDoContentAtom)

  return Object.keys(toDoContent)
}, 'toDoIds')

export const toDoVisibleIdsAtom = atom((ctx) => {
  const content = ctx.spy(toDoContentAtom)
  const ids = ctx.get(toDoIdsAtom)
  const filter = ctx.spy(filterAtom)

  if (filter === VISIBILITY_FILTERS.ALL) return ids

  return ids.reduce((acc, id) => {
    const isDone = ctx.spy(ctx.get(content[id]).isDone)
    const isShowDone = filter === VISIBILITY_FILTERS.COMPLETED && isDone
    const isShowUndone = filter === VISIBILITY_FILTERS.INCOMPLETE && !isDone

    return isShowDone || isShowUndone ? [...acc, id] : acc
  }, [])
}, 'toDoVisibleIds')

export const fetchList = action(
  (ctx) => (
    ctx.schedule(async () => {
      const toDoListDto = await api.getList()

      toDoContentAtom(
        ctx,
        toDoListDto.reduce(
          (acc, item) => ({
            ...acc,
            [item.id]: createToDoItemAtom(item),
          }),
          {}
        )
      )
    })
  ),
  'fetchList'
)

export const createToDoItem = action(
  (ctx, payload) => (
    ctx.schedule(async () => {
      const item = await api.createItem(payload)
      const newToDo = createToDoItemAtom(item)

      toDoContentAtom(ctx, (content) => ({ ...content, [item.id]: newToDo }))
      inputAtom(ctx, '')
    })
  ),
  'createToDoItem'
)

export const saveToDoItem = action(
  (ctx, payload) => (
    ctx.schedule(async () => {
      const { id, title, isDone } = await api.patchItem(payload)
      const itemToUpdate = ctx.get(toDoContentAtom)[id]

      ctx.get(itemToUpdate).isDone(ctx, isDone)
    })
  ),
  'saveToDoItem'
)

export const deleteToDoItem = action(
  (ctx, itemId) => (
    ctx.schedule(async () => {
      const response = await api.deleteItem(itemId)
      if (response) {
        toDoContentAtom(ctx, (content) => {
          const newContent = { ...content }
          delete newContent[itemId]

          return newContent
        })
      }
    })
  ),
  'deleteToDoItem'
)
