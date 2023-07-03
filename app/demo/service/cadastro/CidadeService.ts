import { Demo } from "../../../../types/types";

export const CidadeService = {
  url: 'http://localhost:8080/api',

  getAll() {
    return fetch(`${this.url}/cidade/`)
      .then((res) => res.json())
      .then((data) => data as Demo.Cidade[])
      .catch((error) => {
        console.error('Erro:', error);
      });
  },

  create(objeto: Demo.Cidade) {
    return fetch(`${this.url}/cidade/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(objeto),
    })
      .then((res) => res.json())
      .then((data) => data as Demo.Cidade)
      .catch((error) => {
        console.error('Erro:', error);
      });
  },

  update(objeto: Demo.Cidade) {
    return fetch(`${this.url}/cidade/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(objeto),
    })
      .then((res) => res.json())
      .then((data) => data as Demo.Cidade)
      .catch((error) => {
        console.error('Erro:', error);
      });
  },

  delete(id: number) {
    return fetch(`${this.url}/cidade/${id}`, {
      method: "DELETE"
    })
    .then(res => res.ok)
    .catch((error) => {
        console.error('Erro:', error);
    });
  },

  bulkDelete(ids: number[]) {
    return fetch(`${this.url}/cidade/batch`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ids),
    })
      .then(res => res.ok)
      .catch((error) => {
        console.error('Erro:', error);
      });
  },
};
