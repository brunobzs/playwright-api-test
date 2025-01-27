import { test, expect } from '@playwright/test';
import { faker } from "@faker-js/faker";

test.describe('Login', () => {
  test('Should log in successfully', async ({ request }) => {
    const usuariosResponse = await request.get('/usuarios');
    const usuariosBody = await usuariosResponse.json();
    const { email, password } = usuariosBody.usuarios[0];
    // Authenticate with the first user in the list
    const loginResponse = await request.post('/login', { data: { email, password } });;
    const loginBody = await loginResponse.json();
    // Verify successful authentication
    expect(loginResponse.status()).toBe(200);
    expect(loginBody.message).toBe('Login realizado com sucesso');
  });

  test('Should not log in with invalid credentials', async ({ request }) => {
    const { email, password } = {
      email: faker.internet.email(),
      password: faker.internet.password()
    };
    const response = await request.post('/login', { data: { email, password } });
    const body = await response.json();
    // Verify unsuccessful authentication
    expect(response.status()).toBe(401);
    expect(body.message).toBe('Email e/ou senha inválidos');
  });
});