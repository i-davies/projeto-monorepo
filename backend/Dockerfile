# ==============================================================================
# Estágio 1: Build da Aplicação
# ==============================================================================
FROM node:24-alpine AS builder

WORKDIR /app

# Instala o pnpm globalmente (evita problemas com corepack e semver)
RUN npm install -g pnpm@latest

# Desativa a restrição do pnpm 11 antes da instalação
RUN pnpm config set strict-dep-builds false

# Copia os manifestos de dependências (hífen correto: pnpm-lock.yaml)
COPY package.json pnpm-lock.yaml* ./

# Instala todas as dependências (com frozen-lockfile correto)
RUN pnpm install --frozen-lockfile

# Copia código-fonte e configuração do TypeScript
COPY tsconfig.json ./
COPY src ./src

# Compila o TypeScript gerando a pasta dist/
RUN pnpm run build

# Remove as devDependencies mantendo apenas o necessário para produção
RUN pnpm prune --prod

# ==============================================================================
# Estágio 2: Imagem Final de Execução (Produção enxuta)
# ==============================================================================
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Cria usuário sem privilégios de root para segurança
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copia apenas o necessário do estágio de build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

USER nodejs

EXPOSE 3000

CMD ["node", "dist/server.js"]
