import { afterAll, beforeAll, test, describe, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('Users routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex -- migrate:rollback --all')
    execSync('npm run knex -- migrate:latest')
  })

  test('Can create user', async () => {
    await request(app.server)
      .post('/users/sign-up')
      .send({
        name: 'teste',
        email: 'teste@teste.com',
        password: '12345678',
      })
      .expect(201)
  })

  test('User can sign in', async () => {
    await request(app.server).post('/users/sign-up').send({
      name: 'teste',
      email: 'teste@teste.com',
      password: '12345678',
    })

    await request(app.server)
      .post('/users/sign-in')
      .send({
        email: 'teste@teste.com',
        password: '12345678',
      })
      .expect(200)
  })
})
