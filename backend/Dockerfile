# Estágio 1: Build da Aplicação

# 1. Define a imagem de origem base 
FROM node:24-alpine AS builder

# Instalação do pnpm globalmente
RUN corepack enable && corepack prepara pnpm@latest --activate

# 2. Define diretório de trabalho interno do container
WORKDIR /app

# Copia dos manifestos de depedências do backend
COPY package.json pnpm.lock.yaml* ./

# Instalação de todas as dependências (incluindo devDependencies para o build)
RUN npm install --fronzen-lockfile

# Desativa a restrição do pnpm 11
RUN pnpm config set strict-dep-builds false

# Copia do código-fonte e da configuração do TypeScript
COPY tsconfig.json ./
COPY src ./src

# Compilação do TypeScript para Javascript (gera a pasta dist/)
RUN pnpm run build

# Remoção das dependências de desenvolvimento para diminuir o tamanho final
RUN pnpm prune --prod

# Estágio 2: Imagem Final de Execução (Produção)
FROM node:24-alpine AS runner

WORKDIR /app

# Definição do ambiente como produção

ENV NODE_ENV=production
ENV PORT=3000