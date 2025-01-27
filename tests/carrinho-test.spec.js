import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker'

test.describe('Shopping Cart', () => {
  let authToken;
  const novoUsuario = {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    administrador: "true"
  }

  test.beforeAll(async ({ request }) => {
    // Step 1: Check if the default user exists and delete it if found
    const response = await request.get(`/usuarios?email=${novoUsuario.email}`);
    const { quantidade, usuarios } = await response.json();
    if (quantidade > 0) {
      const { _id } = usuarios[0];
      await request.delete(`/usuarios/${_id}`);
    }

    // Step 2: Create the default user
    const usuarioResponse = await request.post('/usuarios', { data: novoUsuario });
    expect(usuarioResponse.status()).toBe(201); // Verify the user creation status is 201
    expect((await usuarioResponse.json()).message).toBe('Cadastro realizado com sucesso'); // Confirm success message

    // Step 3: Authenticate and obtain the token
    const { email, password } = novoUsuario;
    const loginResponse = await request.post('/login', { data: { email, password } });
    const body = await loginResponse.json();
    expect(loginResponse.status()).toBe(200); // Verify successful authentication
    authToken = body.authorization; // Store the authentication token
  });

  test('Should create a new cart for the user and delete', async ({ request }) => {
    // Create a cart with specified products
    const response = await request.post('/carrinhos',{
      headers: {
        Authorization: authToken
      },
      data: {
        "produtos": [
          {
            "idProduto": "BeeJh5lz3k6kSIzA",
            "quantidade": 1
          },
          {
            "idProduto": "K6leHdftCeOJj8BJ",
            "quantidade": 3
          }
        ]
      }
    });
    const { message, _id } = await response.json();
    expect(response.status()).toBe(201); // Verify cart creation status is 201
    expect(message).toBe('Cadastro realizado com sucesso'); // Confirm success message

    // Verify the cart was created successfully
    const carrinhoResponse = await request.get(`/carrinhos/${_id}`);
    const { quantidadeTotal } = await carrinhoResponse.json();
    expect(carrinhoResponse.status()).toBe(200); // Verify successful retrieval
    expect(quantidadeTotal).toBe(4);

    // Delete the cart
    const deleteResponse = await request.delete(' /carrinhos/concluir-compra/', {
      headers: { Authorization: authToken }
    });
    const body = await deleteResponse.json();
    expect(deleteResponse.status()).toBe(200); // Verify successful deletion
    expect(body.message).toBe('Registro excluído com sucesso'); // Confirm success message
  });
});
