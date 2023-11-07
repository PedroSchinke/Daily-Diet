import fastify from 'fastify'
import { env } from './env'
import { mealsRoutes } from './routes/meals'

const app = fastify()

app.register(mealsRoutes, {
  prefix: 'meals',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('server is running!')
  })
