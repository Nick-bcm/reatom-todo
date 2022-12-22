import React from 'react'
import { useAction, useAtom } from '@reatom/npm-react'

import { VISIBILITY_FILTERS, filterAtom, setFilter } from './model'

const Filters = () => {
  const filterKeys = Object.keys(VISIBILITY_FILTERS)
  const [activeFilter] = useAtom(filterAtom)
  const changeFilter = useAction(setFilter)

  return (
    <div className="btn-group  btn-group-sm" role="group">
      {filterKeys.map((key) => {
        const filter = VISIBILITY_FILTERS[key]

        return (
          <React.Fragment key={key}>
            <input
              type="radio"
              className="btn-check"
              name="btnradio"
              id={`filter_${filter}`}
              autoComplete="off"
              checked={activeFilter === filter}
              onChange={changeFilter}
              value={filter}
            />
            <label className="btn btn-outline-primary" htmlFor={`filter_${filter}`}>
              {filter}
            </label>
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default Filters
