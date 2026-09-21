const request = require('supertest');
const express = require('express');
const cors = require('cors');
const sequelize = require('../config/database');
const userRoutes = require('../routes/userRoutes');
require('../models/User');

const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api/users', userRoutes);
  return app;
};

describe('User API', () => {
  let app;
  let server;
  let testUserId;

  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    app = createApp();
    server = app.listen(0);
  });

  afterAll(async () => {
    await new Promise(resolve => server.close(resolve));
    await sequelize.close();
  });

  beforeEach(async () => {
    // Clean up users table before each test
    const User = require('../models/User');
    await User.destroy({ where: {}, truncate: true, restartIdentity: true });
  });

  const validUser = {
    nombre: 'Juan',
    apellido: 'Pérez',
    documento: '12345678',
    legajo: 'EMP-001',
    email: 'juan.perez@test.com',
    domicilio: 'Av. Corrientes 1234, CABA'
  };

  describe('POST /api/users', () => {
    test('debe crear un usuario válido', async () => {
      const res = await request(app)
        .post('/api/users')
        .send(validUser)
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.nombre).toBe(validUser.nombre);
      expect(res.body.apellido).toBe(validUser.apellido);
      expect(res.body.documento).toBe(validUser.documento);
      expect(res.body.legajo).toBe(validUser.legajo);
      expect(res.body.email).toBe(validUser.email);
      expect(res.body.domicilio).toBe(validUser.domicilio);
      testUserId = res.body.id;
    });

    test('debe rechazar usuario sin campos obligatorios', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ nombre: 'Juan' })
        .expect(400);

      expect(res.body.error).toBe('Todos los campos son obligatorios');
    });

    test('debe rechazar email inválido', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ ...validUser, email: 'invalid-email' })
        .expect(400);

      expect(res.body.error).toContain('email');
    });

    test('debe rechazar documento duplicado', async () => {
      await request(app).post('/api/users').send(validUser).expect(201);
      
      const res = await request(app)
        .post('/api/users')
        .send({ ...validUser, legajo: 'EMP-002', email: 'otro@test.com' })
        .expect(400);

      expect(res.body.error).toBe('El documento ya está registrado');
    });

    test('debe rechazar legajo duplicado', async () => {
      await request(app).post('/api/users').send(validUser).expect(201);
      
      const res = await request(app)
        .post('/api/users')
        .send({ ...validUser, documento: '87654321', email: 'otro@test.com' })
        .expect(400);

      expect(res.body.error).toBe('El legajo ya está registrado');
    });

    test('debe rechazar email duplicado', async () => {
      await request(app).post('/api/users').send(validUser).expect(201);
      
      const res = await request(app)
        .post('/api/users')
        .send({ ...validUser, documento: '87654321', legajo: 'EMP-002' })
        .expect(400);

      expect(res.body.error).toBe('El email ya está registrado');
    });
  });

  describe('GET /api/users', () => {
    test('debe listar usuarios vacíos inicialmente', async () => {
      const res = await request(app).get('/api/users').expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });

    test('debe listar usuarios creados', async () => {
      await request(app).post('/api/users').send(validUser).expect(201);
      await request(app).post('/api/users').send({
        ...validUser,
        documento: '87654321',
        legajo: 'EMP-002',
        email: 'otro@test.com'
      }).expect(201);

      const res = await request(app).get('/api/users').expect(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0].nombre).toBe(validUser.nombre);
    });
  });

  describe('GET /api/users/:id', () => {
    test('debe obtener un usuario por ID', async () => {
      const createRes = await request(app).post('/api/users').send(validUser).expect(201);
      const userId = createRes.body.id;

      const res = await request(app).get(`/api/users/${userId}`).expect(200);
      expect(res.body.id).toBe(userId);
      expect(res.body.nombre).toBe(validUser.nombre);
    });

    test('debe retornar 404 para ID inexistente', async () => {
      const res = await request(app).get('/api/users/999').expect(404);
      expect(res.body.error).toBe('Usuario no encontrado');
    });
  });

  describe('PUT /api/users/:id', () => {
    test('debe actualizar email y domicilio', async () => {
      const createRes = await request(app).post('/api/users').send(validUser).expect(201);
      const userId = createRes.body.id;

      const res = await request(app)
        .put(`/api/users/${userId}`)
        .send({
          email: 'nuevo@test.com',
          domicilio: 'Nueva dirección 456'
        })
        .expect(200);

      expect(res.body.email).toBe('nuevo@test.com');
      expect(res.body.domicilio).toBe('Nueva dirección 456');
      expect(res.body.nombre).toBe(validUser.nombre); // no cambia
    });

    test('debe actualizar solo email', async () => {
      const createRes = await request(app).post('/api/users').send(validUser).expect(201);
      const userId = createRes.body.id;

      const res = await request(app)
        .put(`/api/users/${userId}`)
        .send({ email: 'solo-email@test.com' })
        .expect(200);

      expect(res.body.email).toBe('solo-email@test.com');
      expect(res.body.domicilio).toBe(validUser.domicilio);
    });

    test('debe rechazar email duplicado en actualización', async () => {
      await request(app).post('/api/users').send(validUser).expect(201);
      const createRes = await request(app).post('/api/users').send({
        ...validUser,
        documento: '87654321',
        legajo: 'EMP-002',
        email: 'otro@test.com'
      }).expect(201);
      const userId = createRes.body.id;

      const res = await request(app)
        .put(`/api/users/${userId}`)
        .send({ email: validUser.email })
        .expect(400);

      expect(res.body.error).toBe('El email ya está registrado');
    });

    test('debe retornar 404 para ID inexistente', async () => {
      const res = await request(app)
        .put('/api/users/999')
        .send({ email: 'test@test.com' })
        .expect(404);

      expect(res.body.error).toBe('Usuario no encontrado');
    });
  });

  describe('DELETE /api/users/:id', () => {
    test('debe eliminar un usuario', async () => {
      const createRes = await request(app).post('/api/users').send(validUser).expect(201);
      const userId = createRes.body.id;

      await request(app).delete(`/api/users/${userId}`).expect(200);

      const res = await request(app).get('/api/users').expect(200);
      expect(res.body.length).toBe(0);
    });

    test('debe retornar 404 para ID inexistente', async () => {
      const res = await request(app).delete('/api/users/999').expect(404);
      expect(res.body.error).toBe('Usuario no encontrado');
    });
  });

  describe('Flujo completo CRUD', () => {
    test('GET → POST → PUT → DELETE', async () => {
      // 1. GET inicial - lista vacía
      let res = await request(app).get('/api/users').expect(200);
      expect(res.body.length).toBe(0);

      // 2. POST - crear usuario
      const createRes = await request(app)
        .post('/api/users')
        .send(validUser)
        .expect(201);
      testUserId = createRes.body.id;

      // 3. GET - verificar creación
      res = await request(app).get('/api/users').expect(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].id).toBe(testUserId);

      // 4. GET por ID
      res = await request(app).get(`/api/users/${testUserId}`).expect(200);
      expect(res.body.email).toBe(validUser.email);

      // 5. PUT - actualizar email y domicilio
      const updatedEmail = 'actualizado@test.com';
      const updatedDomicilio = 'Dirección actualizada 789';
      res = await request(app)
        .put(`/api/users/${testUserId}`)
        .send({ email: updatedEmail, domicilio: updatedDomicilio })
        .expect(200);
      expect(res.body.email).toBe(updatedEmail);
      expect(res.body.domicilio).toBe(updatedDomicilio);

      // 6. GET - verificar actualización
      res = await request(app).get(`/api/users/${testUserId}`).expect(200);
      expect(res.body.email).toBe(updatedEmail);
      expect(res.body.domicilio).toBe(updatedDomicilio);

      // 7. DELETE - eliminar usuario
      await request(app).delete(`/api/users/${testUserId}`).expect(200);

      // 8. GET final - lista vacía
      res = await request(app).get('/api/users').expect(200);
      expect(res.body.length).toBe(0);
    });
  });
});