import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

let authToken;

test.describe('Product', () => {
  test.beforeAll(async ({ request }) => {
    // Search for an admin user
    const usuarioResponse = await request.get('/usuarios');
    const { usuarios } = await usuarioResponse.json();
    const admins = usuarios.filter((usuario) => usuario.administrador === 'true');
    const { email, password } = admins[0];

    // Login with a valid admin user
    const loginResponse = await request.post('/login', { data: { email, password } });
    expect(loginResponse.status()).toBe(200);
    const body = await loginResponse.json();
    authToken = body.authorization;
  });

  test('Should register a product, edit and delete a product', async ({ request }) => {
    const produto = {
      nome: faker.commerce.product(),
      preco: Math.round(faker.commerce.price()),
      descricao: faker.commerce.productDescription(),
      quantidade: Math.floor(Math.random() * 1000) + 1
    };

    // Register a product
    const produtoResponse = await request.post('/produtos', {
      headers: { Authorization: authToken },
      data: produto
    });
    const { _id, message } = await produtoResponse.json();

    if (produtoResponse.status() === 201) {
      expect(message).toBe('Cadastro realizado com sucesso');
    } else {
      expect(message).toBe('Já existe produto com esse nome');
    }

    // Check if the product was registered
    const getProdutoResponse = await request.get(`/produtos/${_id}`, { headers: { Authorization: authToken } });
    const { nome, preco, descricao, quantidade } = await getProdutoResponse.json();
    expect(nome).toBe(produto.nome);
    expect(preco).toBe(produto.preco);
    expect(descricao).toBe(produto.descricao);
    expect(quantidade).toBe(produto.quantidade);

    // Edit the product
    const editProdutoResponse = await request.put(`/produtos/${_id}`, {
      headers: {
        Authorization: authToken
      },
      data: {
        nome: faker.commerce.productName(),
        preco: Math.round(faker.commerce.price()),
        descricao: faker.commerce.productDescription(),
        quantidade: 100
      }
    });
    const editProdutoBody = await editProdutoResponse.json()
    expect(editProdutoResponse.status()).toBe(200);
    expect(editProdutoBody.message).toBe('Registro alterado com sucesso');

    // Delete the product
    const deleteResponse = await request.delete(`/produtos/${_id}`, { headers: { Authorization: authToken } });
    const deleteBody = await deleteResponse.json();
    expect(deleteResponse.status()).toBe(200);
    expect(deleteBody.message).toBe('Registro excluído com sucesso');
  });
});