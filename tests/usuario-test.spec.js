import { test, expect } from '@playwright/test';
import { faker } from "@faker-js/faker";

test.describe('User API Test', () => {
  test('Should create a new user and delete it successfully', async ({ request}) => {
    // Step 1: Create a new user
    const createResponse = await request.post('https://serverest.dev/usuarios', {
      data: {
        nome: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        administrador: "true"
      }
    });

    // Step 2: Store the user ID
    expect(createResponse.status()).toBe(201);
    const { _id } = await createResponse.json();

    // Step 3: Delete the user
    const deleteResponse = await request.delete(`https://serverest.dev/usuarios/${_id}`);
    expect(deleteResponse.status()).toBe(200);
    expect((await deleteResponse.json()).message).toBe('Registro excluído com sucesso');

    // Step 4: Verify deletion
    const getResponse = await request.get(`https://serverest.dev/usuarios/${_id}`);
    expect(getResponse.status()).toBe(400);
    expect((await getResponse.json()).message).toBe('Usuário não encontrado');
  });
});