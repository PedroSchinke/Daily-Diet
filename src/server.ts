import fastify from 'fastify'

const app = fastify()

app.get('/hello', () => {
  return 'Olá'
})

app
  .listen({
    port: 3000,
  })
  .then(() => {
    console.log('server is running!')
  })
