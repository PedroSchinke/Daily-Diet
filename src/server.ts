import fastify from 'fastify'
import { env } from './env'
import { mealsRoutes } from './routes/meals'
import { usersRoutes } from './routes/users'

const app = fastify()

app.register(mealsRoutes, {
  prefix: 'meals',
})

app.register(usersRoutes, {
  prefix: 'users',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('server is running!')
  })
