FROM node:current-alpine3.23 AS base

WORKDIR /app

COPY . .
RUN npm install

FROM base AS production
RUN npm run build
CMD ["node", "dist/main.js"]

FROM base AS development
CMD ["npm", "run", "start:dev"]