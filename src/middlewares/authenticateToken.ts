import { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'
import { env } from '../env'

export function authenticateToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authHeader = request.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token)
    return reply.status(401).send({
      error: 'Unauthorized',
    })

  jwt.verify(token, env.JWT_SECRET)
}
