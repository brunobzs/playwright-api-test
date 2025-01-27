import { test, expect } from '@playwright/test';
import { faker } from "@faker-js/faker";

test.describe('User', () => {
  test('Should create a new user and delete it successfully', async ({ request}) => {
    // Step 1: Create a new user
    const createResponse = await request.post('/usuarios', {
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
    const deleteResponse = await request.delete(`/usuarios/${_id}`);
    const deleteBody = await deleteResponse.json();
    expect(deleteResponse.status()).toBe(200);
    expect(deleteBody.message).toBe('Registro excluído com sucesso');

    // Step 4: Verify deletion
    const getResponse = await request.get(`/usuarios/${_id}`);
    const getBody = await getResponse.json();
    expect(getResponse.status()).toBe(400);
    expect(getBody.message).toBe('Usuário não encontrado');
  });
});