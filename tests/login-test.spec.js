import { test, expect } from '@playwright/test';
import { faker } from "@faker-js/faker";

test.describe('Login API', () => {
  test('Should log in successfully', async ({ request }) => {
    const usuariosResponse = await request.get('https://serverest.dev/usuarios');
    const body = await usuariosResponse.json();
    const { email, password } = body.usuarios[0];
    const loginResponse = await request.post('https://serverest.dev/login', { data: { email, password } });;
    // Verify successful authentication
    expect(loginResponse.status()).toBe(200);
    expect((await loginResponse.json()).message).toBe('Login realizado com sucesso');
  });

  test('Should not log in with invalid credentials', async ({ request }) => {
    const { email, password } = {
      email: faker.internet.email(),
      password: faker.internet.password()
    };
    const response = await request.post('https://serverest.dev/login', { data: { email, password } });
    // Verify unsuccessful authentication
    expect(response.status()).toBe(401);
    expect((await response.json()).message).toBe('Email e/ou senha inválidos');
  });
});