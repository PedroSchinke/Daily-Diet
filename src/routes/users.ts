import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { PasswordCrypto } from '../services/passwordCrypto'
import { JWTService } from '../services/JWT'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/sign-in', async (request, reply) => {
    const getUserParamsSchema = z.object({
      email: z.string(),
      password: z.string(),
    })

    const { email, password } = getUserParamsSchema.parse(request.body)

    const user = await knex('users').where('email', email).first()

    if (!user) return new Error('Email ou senha incorretos')

    const passwordMatch = await PasswordCrypto.verifyPassword(
      password,
      user.password,
    )

    if (!passwordMatch) {
      return new Error('Email ou senha incorretos')
    } else {
      const accessToken = JWTService.sign({ uid: user.id })

      if (accessToken === 'JWT_SECRET_NOT_FOUND') {
        return reply.status(500).send('Erro interno do servidor')
      }
      return reply.status(200).send({ accessToken })
    }
  })

  app.post('/sign-up', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    })

    const { name, email, password } = createUserBodySchema.parse(request.body)

    const hashedPassword = await PasswordCrypto.hashPassword(password)

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      password: hashedPassword,
    })

    return reply.status(201).send('Usuário criado com sucesso!')
  })
}
