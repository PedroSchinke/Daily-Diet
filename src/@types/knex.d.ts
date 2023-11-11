// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    meals: {
      id: string
      title: string
      description: string
      hourOfMeal: number
      minuteOfMeal: number
      onDiet: 'Sim' | 'Não'
      session_id?: string
    }
    users: {
      id: string
      name: string
      email: string
      password: string
    }
  }
}
