import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

let authToken;

test.describe('Product API', () => {
  test.beforeAll(async ({ request }) => {
    // Search for an admin user
    const usuarioResponse = await request.get('https://serverest.dev/usuarios');
    const { usuarios } = await usuarioResponse.json();
    const admins = usuarios.filter((usuario) => usuario.administrador === 'true');
    const { email, password } = admins[0];

    // Login with a valid admin user
    const loginResponse = await request.post('https://serverest.dev/login', { data: { email, password } });
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
    const produtoResponse = await request.post('https://serverest.dev/produtos', {
      headers: { Authorization: authToken },
      data: produto
    });
    const body = await produtoResponse.json();
    console.log(body)
    if (produtoResponse.status() === 201) {
      expect(body.message).toBe('Cadastro realizado com sucesso');
    } else {
      expect(body.message).toBe('Já existe produto com esse nome');
    }
    const { _id } = await produtoResponse.json();

    // Check if the product was registered
    const getProdutoResponse = await request.get(`https://serverest.dev/produtos/${_id}`, { headers: { Authorization: authToken } });
    console.log(getProdutoResponse)
    console.log('body:', await getProdutoResponse.json())
    const { nome, preco, descricao, quantidade } = await getProdutoResponse.json();
    expect(nome).toBe(produto.nome);
    expect(preco).toBe(produto.preco);
    expect(descricao).toBe(produto.descricao);
    expect(quantidade).toBe(produto.quantidade);

    // Edit the product
    const editProdutoResponse = await request.put(`https://serverest.dev/produtos/${_id}`, {
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
    expect(editProdutoResponse.status()).toBe(200);
    expect((await editProdutoResponse.json()).message).toBe('Registro alterado com sucesso');

    // Delete the product
    const deleteResponse = await request.delete(`https://serverest.dev/produtos/${_id}`, { headers: { Authorization: authToken } });
    expect(deleteResponse.status()).toBe(200);
    expect((await deleteResponse.json()).message).toBe('Registro excluído com sucesso');
  });
});