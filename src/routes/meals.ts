import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import jwt from 'jsonwebtoken'
import { env } from '../env'

interface UserPayload {
  userId: string
}

interface CustomRequest extends FastifyRequest {
  user?: UserPayload
}

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook(
    'onRequest',
    async (request: CustomRequest, reply: FastifyReply) => {
      const authHeader = request.headers.authorization
      const token = authHeader && authHeader.split(' ')[1]

      if (!token) {
        reply.code(401).send({
          error: 'Unauthorized',
        })
        return
      }

      try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as UserPayload

        request.user = decoded
      } catch (err) {
        reply.status(403).send({
          error: 'Forbidden',
        })
      }
    },
  )

  app.get('/', async () => {
    const meals = await knex('meals').select()

    return { meals }
  })

  app.get('/:id', async (request) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealParamsSchema.parse(request.params)

    const meal = await knex('meals').where('id', id).first()

    return { meal }
  })

  app.get('/summary', async () => {
    const meals = await knex('meals').select()

    const mealsCount = meals.length

    const onDietMeals = await knex('meals').where('onDiet', 'Sim')

    const onDietMealsCount = onDietMeals.length

    const offDietMeals = await knex('meals').where('onDiet', 'Não')

    const offDietMealsCount = offDietMeals.length

    return { mealsCount, onDietMealsCount, offDietMealsCount }
  })

  app.post('/', async (request: CustomRequest, reply) => {
    const createMealBodySchema = z.object({
      title: z.string(),
      description: z.string(),
      hourOfMeal: z.number().min(0).max(23),
      minuteOfMeal: z.number().min(0).max(59),
      onDiet: z.enum(['Sim', 'Não']),
    })

    const userId = request.user?.userId

    console.log(userId)

    if (!userId) {
      return reply.status(403).send({
        error: 'Sem permissão',
      })
    }

    const { title, description, hourOfMeal, minuteOfMeal, onDiet } =
      createMealBodySchema.parse(request.body)

    await knex('meals').insert({
      id: randomUUID(),
      title,
      description,
      hourOfMeal,
      minuteOfMeal,
      onDiet,
      userId,
    })

    return reply
      .status(201)
      .send({ message: 'Refeição registrada com sucesso!' })
  })

  app.put('/:id', async (request, reply) => {
    const updateMealBodySchema = z.object({
      title: z.string(),
      description: z.string(),
      hourOfMeal: z.number().min(0).max(23),
      minuteOfMeal: z.number().min(0).max(59),
      onDiet: z.enum(['Sim', 'Não']),
    })

    const updateMealParamsSchema = z.object({
      id: z.string(),
    })

    const { title, description, hourOfMeal, minuteOfMeal, onDiet } =
      updateMealBodySchema.parse(request.body)

    const { id } = updateMealParamsSchema.parse(request.params)

    await knex('meals')
      .update({
        title,
        description,
        hourOfMeal,
        minuteOfMeal,
        onDiet,
      })
      .where('id', id)

    return reply.status(204).send({ message: 'Refeição editada com sucesso!' })
  })

  app.delete('/:id', async (request, reply) => {
    const deleteMealParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = deleteMealParamsSchema.parse(request.params)

    await knex('meals').delete().where('id', id)

    return reply.status(204).send({ message: 'Refeição deletada com sucesso!' })
  })
}
