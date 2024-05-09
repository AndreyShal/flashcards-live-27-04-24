import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/copmponents/ui/button'
import { TextField } from '@/copmponents/ui/text-field'
import { useGetDecksQuery } from '@/services/base-api'

export const Decks = () => {
  const [search, setSearch] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  // const { data, isLoading } = useGetDecksQuery({
  //   currentPage,
  //   name: search,
  // })
  const { data, isLoading } = useGetDecksQuery()

  if (isLoading) {
    return <h1>LOADING....</h1>
  }

  const paginationOptions = []

  for (let i = 0; i < (data?.pagination?.totalPages ?? 0); i++) {
    paginationOptions.push(i + 1)
  }

  const mappedData = data?.items.map(deck => ({
    cards: deck.cardsCount,
    createdBy: deck.author.name,
    id: deck.id,
    lastUpdated: deck.updated,
    name: deck.name,
  }))

  return (
    <div>
      <TextField onChange={e => setSearch(e.currentTarget.value)} value={search} />
      <div>{JSON.stringify(mappedData)}</div>
      <Link to={'/2'}>Go to page 2</Link>
      {paginationOptions.map(i => {
        return (
          <Button key={i} onClick={() => setCurrentPage(i)}>
            {i}
          </Button>
        )
      })}
    </div>
  )
}
