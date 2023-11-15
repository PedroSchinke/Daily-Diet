import { afterAll, beforeAll, beforeEach, test, describe, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('Meals routes', () => {
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

  test('User can create a new meal', async () => {
    await request(app.server).post('/users/sign-up').send({
      name: 'teste',
      email: 'teste2@teste.com',
      password: '12345678',
    })

    const response = await request(app.server)
      .post('/users/sign-in')
      .send({
        email: 'teste2@teste.com',
        password: '12345678',
      })
      .expect(200)

    const token = response.body.accessToken

    await request(app.server)
      .post('/meals')
      .send({
        title: 'teste',
        description: 'teste',
        dateOfMeal: '13/11/23',
        hourOfMeal: 20,
        minuteOfMeal: 0,
        onDiet: 'Sim',
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
  })

  test('User can list meals', async () => {
    await request(app.server).post('/users/sign-up').send({
      name: 'teste',
      email: 'teste2@teste.com',
      password: '12345678',
    })

    const response = await request(app.server)
      .post('/users/sign-in')
      .send({
        email: 'teste2@teste.com',
        password: '12345678',
      })
      .expect(200)

    const token = response.body.accessToken

    await request(app.server)
      .post('/meals')
      .send({
        title: 'teste',
        description: 'teste',
        dateOfMeal: '13/11/23',
        hourOfMeal: 20,
        minuteOfMeal: 0,
        onDiet: 'Sim',
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(201)

    await request(app.server)
      .get('/meals')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  test('User can get a specific meal', async () => {
    await request(app.server).post('/users/sign-up').send({
      name: 'teste',
      email: 'teste2@teste.com',
      password: '12345678',
    })

    const response = await request(app.server).post('/users/sign-in').send({
      email: 'teste2@teste.com',
      password: '12345678',
    })

    const token = response.body.accessToken

    await request(app.server)
      .post('/meals')
      .send({
        title: 'teste',
        description: 'teste',
        dateOfMeal: '13/11/23',
        hourOfMeal: 20,
        minuteOfMeal: 0,
        onDiet: 'Sim',
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Authorization', `Bearer ${token}`)

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  test('User can get summary of meals', async () => {
    await request(app.server).post('/users/sign-up').send({
      name: 'teste',
      email: 'teste2@teste.com',
      password: '12345678',
    })

    const response = await request(app.server).post('/users/sign-in').send({
      email: 'teste2@teste.com',
      password: '12345678',
    })

    const token = response.body.accessToken

    await request(app.server)
      .post('/meals')
      .send({
        title: 'teste',
        description: 'teste',
        dateOfMeal: '13/11/23',
        hourOfMeal: 20,
        minuteOfMeal: 0,
        onDiet: 'Sim',
      })
      .set('Authorization', `Bearer ${token}`)

    const summaryResponse = await request(app.server)
      .get('/meals/summary')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(summaryResponse.body.summary).toEqual({
      mealsCount: 1,
      onDietMealsCount: 1,
      offDietMealsCount: 0,
    })
  })

  test('User can delete a meal', async () => {
    await request(app.server).post('/users/sign-up').send({
      name: 'teste',
      email: 'teste2@teste.com',
      password: '12345678',
    })

    const response = await request(app.server).post('/users/sign-in').send({
      email: 'teste2@teste.com',
      password: '12345678',
    })

    const token = response.body.accessToken

    await request(app.server)
      .post('/meals')
      .send({
        title: 'teste',
        description: 'teste',
        dateOfMeal: '13/11/23',
        hourOfMeal: 20,
        minuteOfMeal: 0,
        onDiet: 'Sim',
      })
      .set('Authorization', `Bearer ${token}`)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Authorization', `Bearer ${token}`)

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
  })

  test('User can update a meal', async () => {
    await request(app.server).post('/users/sign-up').send({
      name: 'teste',
      email: 'teste2@teste.com',
      password: '12345678',
    })

    const response = await request(app.server).post('/users/sign-in').send({
      email: 'teste2@teste.com',
      password: '12345678',
    })

    const token = response.body.accessToken

    await request(app.server)
      .post('/meals')
      .send({
        title: 'teste',
        description: 'teste',
        dateOfMeal: '13/11/23',
        hourOfMeal: 20,
        minuteOfMeal: 0,
        onDiet: 'Sim',
      })
      .set('Authorization', `Bearer ${token}`)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Authorization', `Bearer ${token}`)

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .send({
        title: 'teste1',
        description: 'teste1',
        dateOfMeal: '14/11/23',
        hourOfMeal: 21,
        minuteOfMeal: 10,
        onDiet: 'Não',
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
  })
})
