import { Autocomplete, TextField } from '@material-ui/core'
import { AutocompleteRenderInputParams } from '@material-ui/core/Autocomplete'
import { ComponentsProps, StyledComponentProps } from '@material-ui/core/styles'
import { throttle } from 'lodash'
import React, { SyntheticEvent, useMemo, useState } from 'react'
import { useAsync, useList } from 'react-use'

import { Investment } from '../../type'

export type SearchBarProps = StyledComponentProps<keyof Exclude<Exclude<ComponentsProps['MuiAutocomplete'], undefined>['classes'], undefined>> & {
  onSearch: (query: string) => Promise<Investment[]>
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, classes, innerRef }) => {
  const fetch = useMemo(() => throttle(onSearch, 200), [])
  const [values, { set: setValues }] = useList<Investment>([])
  const [query, setQuery] = useState('')
  const [options, { set: setOptions }] = useList<Investment>([])

  useAsync(async () => {
    if (query === '') {
      // don't request when no query
      return
    }
    const results = await fetch(query)
    if (results) {
      setOptions(results)
    }
  }, [query, fetch])
  return (
    <Autocomplete<Investment, true>
      classes={classes}
      innerRef={innerRef}
      id='search-bar'
      autoComplete
      multiple
      style={{
        width: 300
      }}
      size='small'
      value={values}
      options={options}
      getOptionLabel={(option) => option.name ?? ''}
      getOptionSelected={(option: Investment, value: Investment) => option.name === value.name}
      onChange={(event: SyntheticEvent, value: Investment[] | null) => {
        if (value) {
          setValues(value)
        }
      }}
      onInputChange={(_: SyntheticEvent, v: string) => {
        setQuery(v)
      }}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField
          {...params}
          fullWidth
          color='primary'
          placeholder='搜索'
          inputMode='search'
        />)
      }
    />
  )
}

export default SearchBar
