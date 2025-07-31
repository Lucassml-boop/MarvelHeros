# Marvel Heroes

Marvel Heroes é uma aplicação web desenvolvida com React, TypeScript e Vite que permite buscar, visualizar detalhes e favoritar personagens do universo Marvel, utilizando a API oficial da Marvel.

## Funcionalidades

- **Busca de personagens:** Pesquise heróis pelo nome e acesse rapidamente seus detalhes.
- **Detalhes do personagem:** Veja informações, descrição, quadrinhos e séries de cada personagem.
- **Favoritar personagens:** Adicione até 5 personagens aos favoritos (armazenados localmente).
- **Avaliação:** Dê uma nota de 1 a 5 estrelas para cada personagem.
- **Últimos quadrinhos:** Veja os quadrinhos mais recentes lançados para cada personagem.

## Tecnologias Utilizadas

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Axios](https://axios-http.com/)
- [MD5](https://www.npmjs.com/package/md5) (para autenticação na API Marvel)
- [React Router](https://reactrouter.com/)

## Como rodar o projeto

### 1. Clone o repositório

```bash
git clone [https://github.com/seu-usuario/marvelHeros.git](https://github.com/Lucassml-boop/MarvelHeros)
cd marvelHeros
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as chaves da API Marvel

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
VITE_MARVEL_PUBLIC_KEY=SuaPublicKeyAqui
VITE_MARVEL_PRIVATE_KEY=SuaPrivateKeyAqui
```

Obtenha suas chaves em: [Marvel Developer Portal](https://developer.marvel.com/)

### 4. Execute o projeto

```bash
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173) no navegador.

## Estrutura de Pastas

```
src/
  components/
    characters/
      CharacterDetail.tsx
      ...
  assets/
  ...
```

## Observações

- Os favoritos e avaliações são salvos no `localStorage` do navegador.
- O limite de favoritos é 5 personagens.

---

## Resposta técnica: Como lidar com o limite de 5 favoritos usando Redux ou Zustand?

Se estivesse utilizando Redux ou Zustand para gerenciar o estado global dos favoritos, o controle do limite seria feito diretamente no reducer (Redux) ou na função de atualização do estado (Zustand). Ao tentar adicionar um novo personagem aos favoritos, a lógica verificaria se o array já possui 5 itens; caso positivo, impediria a adição e poderia disparar uma mensagem de erro ou alerta para o usuário.

No Redux, isso seria implementado dentro do case do reducer responsável por adicionar favoritos, retornando o estado anterior se o limite fosse atingido. No Zustand, a função de atualização faria a mesma checagem antes de modificar o estado. Dessa forma, o limite é garantido centralmente, tornando o controle mais previsível e fácil de testar, além de evitar duplicação de lógica em múltiplos componentes.
