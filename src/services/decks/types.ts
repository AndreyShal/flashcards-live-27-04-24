import { components, operations } from '@/services/schema'

export type GetDecksResponse = components['schemas']['PaginatedDecks']
export type GetDecksArgs = operations['DecksController_findAllV2']['parameters']['query']
