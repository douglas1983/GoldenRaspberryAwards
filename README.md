# 🎬 Raspberry API - Golden Raspberry Awards

API RESTful que expõe dados dos indicados e vencedores da categoria **"Pior Filme"** do Golden Raspberry Awards.

---

## 📦 Tecnologias utilizadas

- **Node.js** + **Express**
- **TypeScript**
- **SQLite** (in-memory, para simplicidade e testes rápidos)
- **CSV Parser** (leitura de dados do arquivo original)
- **Clean Architecture**
- **Jest** + **Supertest** (testes de integração)

---

## 🚀 Como executar o projeto

```bash
# Instale as dependências
npm install

# Execute a aplicação
npm start

# Acesse em: http://localhost:3000/awards/intervals
```

> A base de dados é carregada automaticamente a partir do CSV na inicialização do servidor.

---

## 🧪 Testes de integração

```bash
npm test
```

- Os testes cobrem todos os endpoints (`GET`, `POST`, `PUT`, `DELETE`)
- Utilizam `supertest` para chamadas HTTP reais à API em memória

---

## 📄 Endpoints disponíveis

### 🔍 GET /awards

Retorna a lista de filmes, com suporte a filtros:

| Parâmetro | Tipo      | Descrição                                 |
| --------- | --------- | ----------------------------------------- |
| `year`    | `number`  | Ano da premiação                          |
| `winner`  | `boolean` | Filtra apenas vencedores (`true` / `false`) |
| `studio`  | `string`  | Nome parcial ou completo do estúdio       |

**Exemplo de chamada:**

```
GET /awards?year=1985&winner=true&studio=Columbia
```

**Exemplo de resposta:**

```json
[
  {
    "id": 31,
    "year": 1985,
    "title": "Rambo: First Blood Part II",
    "studios": "Columbia Pictures",
    "producers": "Buzz Feitshans",
    "winner": 1
  },
  {
    "id": 32,
    "year": 1985,
    "title": "Fever Pitch",
    "studios": "MGM, United Artists",
    "producers": "Freddie Fields",
    "winner": 0
  },
  {
    "id": 33,
    "year": 1985,
    "title": "Revolution",
    "studios": "Warner Bros.",
    "producers": "Irwin Winkler",
    "winner": 0
  },
  {
    "id": 34,
    "year": 1985,
    "title": "Rocky IV",
    "studios": "MGM, United Artists",
    "producers": "Irwin Winkler and Robert Chartoff",
    "winner": 0
  },
  {
    "id": 35,
    "year": 1985,
    "title": "Year of the Dragon",
    "studios": "MGM, United Artists",
    "producers": "Dino De Laurentiis",
    "winner": 0
  }
]
```

---

### 🏆 GET /awards/intervals

Retorna os produtores com os **maiores** e **menores intervalos** entre vitórias.

**Exemplo de resposta:**

```json
{
  "min": [
    {
      "producer": "Bo Derek",
      "interval": 1,
      "previousWin": 1984,
      "followingWin": 1985
    }
  ],
  "max": [
    {
      "producer": "Joel Silver",
      "interval": 10,
      "previousWin": 1990,
      "followingWin": 2000
    }
  ]
}
```

---

### 🔧 CRUD de premiações

| Método | Rota           | Descrição                        |
| ------ | -------------- | ------------------------------- |
| GET    | `/awards/:id`  | Retorna um prêmio por ID         |
| POST   | `/awards`      | Cria um novo registro de prêmio  |
| PUT    | `/awards/:id`  | Atualiza um prêmio existente     |
| DELETE | `/awards/:id`  | Remove um prêmio pelo ID         |

---

## 🧼 Arquitetura utilizada

O projeto segue os princípios da **Clean Architecture**, com separação clara entre:

- **Domínio**: entidades e casos de uso
- **Infraestrutura**: banco de dados, CSV, repositórios
- **Apresentação**: controladores e rotas

---

## 📁 Estrutura de diretórios

```
src/
 ├── domain/         # Entidades e casos de uso
 ├── infra/          # Banco de dados, CSV loader, repositórios
 ├── presentation/   # Controllers e rotas
 ├── app.ts          # Instância do Express
 └── server.ts       # Inicialização do servidor
```

---

## 🧑‍💻 Desenvolvido para avaliação técnica.