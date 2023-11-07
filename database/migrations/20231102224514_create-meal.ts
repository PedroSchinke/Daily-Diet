import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary().index()
    table.text('title').notNullable()
    table.text('description').notNullable()
    table.enum('onDiet', ['Sim', 'Não']).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
