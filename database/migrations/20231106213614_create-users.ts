import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().index()
    table.text('name').notNullable()
    table.text('email').index().unique().notNullable()
    table.text('password').notNullable().checkLength('>', 6)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}
