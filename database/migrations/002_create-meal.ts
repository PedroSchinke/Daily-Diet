import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary().index()
    table.text('title').notNullable()
    table.text('description').notNullable()
    table.date('dateOfMeal').notNullable()
    table.decimal('hourOfMeal').notNullable()
    table.decimal('minuteOfMeal').notNullable()
    table.enum('onDiet', ['Sim', 'Não']).notNullable()
    table.uuid('userId').unsigned()
    table.foreign('userId').references('users.id')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
