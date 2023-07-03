import { Demo } from "../../../../types/types";

function criarService<T>(url: string) {
  return {
    url,

    getAll() {
      return fetch(`${this.url}/`)
        .then((res) => res.json())
        .then((data) => data as T[])
        .catch((error) => {
          console.error("Erro:", error);
        });
    },

    create(objeto: T) {
      return fetch(`${this.url}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objeto),
      })
        .then((res) => res.json())
        .then((data) => data as T)
        .catch((error) => {
          console.error("Erro:", error);
        });
    },

    update(objeto: T) {
      return fetch(`${this.url}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objeto),
      })
        .then((res) => res.json())
        .then((data) => data as T)
        .catch((error) => {
          console.error("Erro:", error);
        });
    },

    delete(id: number) {
      return fetch(`${this.url}/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.ok)
        .catch((error) => {
          console.error("Erro:", error);
        });
    },

    bulkDelete(ids: number[]) {
      return fetch(`${this.url}/batch`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ids),
      })
        .then((res) => res.ok)
        .catch((error) => {
          console.error("Erro:", error);
        });
    },
  };
}

export const EstadoService = criarService<Demo.Estado>("http://localhost:8080/api/estado");
export const CidadeService = criarService<Demo.Cidade>("http://localhost:8080/api/cidade");
export const MarcaService = criarService<Demo.Marca>("http://localhost:8080/api/marca");
export const CategoriaService = criarService<Demo.Categoria>("http://localhost:8080/api/categoria");
export const ProdutoService = criarService<Demo.Produto>("http://localhost:8080/api/produto");
export const PermissaoService = criarService<Demo.Permissao>("http://localhost:8080/api/permissao");
export const PessoaService = criarService<Demo.Pessoa>("http://localhost:8080/api/pessoa");
