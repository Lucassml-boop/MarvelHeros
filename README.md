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
git clone https://github.com/Lucassml-boop/MarvelHeros.git
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
  public/
    assets/                # Imagens, ícones e arquivos estáticos
  components/
    header/              # Cabeçalho da aplicação
      Header.tsx
      Header.css
    footer/              # Rodapé da aplicação
      Footer.tsx
      Footer.css
    search/              # Barra de busca reutilizável
      SearchBar.tsx
      SearchBar.css
    characters/          # Funcionalidades de personagens
      CharacterList.tsx      # Listagem de personagens
      CharacterCard.tsx      # Card individual de personagem
      CharacterDetail.tsx    # Página de detalhes do personagem
      CharacterList.css
      CharacterCard.css
      CharacterDetail.css
  types/                 # Tipos TypeScript customizados
  App.tsx                # Componente principal
  main.tsx               # Ponto de entrada da aplicação
  index.css              # Estilos globais
```

## Observações

- Os favoritos e avaliações são salvos no `localStorage` do navegador.
- O limite de favoritos é 5 personagens.

---
