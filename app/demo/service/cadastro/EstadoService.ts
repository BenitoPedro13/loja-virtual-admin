import { Demo } from "../../../../types/types";

export const EstadoService = {
  url: 'http://localhost:8080/api',

  getAll() {
    return fetch(`${this.url}/estado/`)
      .then((res) => res.json())
      .then((data) => data as Demo.Estado[])
      .catch((error) => {
        console.error('Erro:', error);
      });
  },

  create(objeto: Demo.Estado) {
    return fetch(`${this.url}/estado/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(objeto),
    })
      .then((res) => res.json())
      .then((data) => data as Demo.Estado)
      .catch((error) => {
        console.error('Erro:', error);
      });
  },

  update(objeto: Demo.Estado) {
    return fetch(`${this.url}/estado/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(objeto),
    })
      .then((res) => res.json())
      .then((data) => data as Demo.Estado)
      .catch((error) => {
        console.error('Erro:', error);
      });
  },

  delete(id: number) {
    return fetch(`${this.url}/estado/${id}`, {
      method: "DELETE"
    })
    .then(res => res.ok)
    .catch((error) => {
        console.error('Erro:', error);
    });
  },

  bulkDelete(ids: number[]) {
    return fetch(`${this.url}/estado/batch`, {
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
