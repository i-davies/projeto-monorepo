# ==============================================================================
# Estágio 1: Build da Aplicação
# ==============================================================================
FROM node:20-alpine AS builder

# Instalação do pnpm globalmente
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copia dos manifestos de dependências do backend
COPY package.json pnpm-lock.yaml* ./

# Instalação de todas as dependências (incluindo devDependencies para o build)
RUN pnpm install --frozen-lockfile

# Copia do código-fonte e da configuração do TypeScript
COPY tsconfig.json ./
COPY src ./src

# Compilação do TypeScript para JavaScript (gera a pasta dist/)
RUN pnpm run build

# Remoção das dependências de desenvolvimento para diminuir o tamanho final
RUN pnpm prune --prod

# ==============================================================================
# Estágio 2: Imagem Final de Execução (Produção)
# ==============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Definição do ambiente como produção
ENV NODE_ENV=production
ENV PORT=3000

# Criação de um usuário do sistema sem privilégios de root para segurança
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copia dos manifestos, dependências de produção e artefatos compilados
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Ajuste de permissões para o usuário não-root
USER nodejs

# Exposição da porta padrão da API
EXPOSE 3000

# Comando de inicialização do servidor compilado
CMD ["node", "dist/server.js"]