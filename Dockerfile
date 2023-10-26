FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json .
RUN npm ci

COPY tsconfig.json .
COPY next.config.mjs .
COPY drizzle.config.ts .

ENV NEXT_TELEMETRY_DISABLED 1

CMD npm run dev
