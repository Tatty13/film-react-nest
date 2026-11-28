FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM alpine:3.22 AS production

COPY --from=build /app/dist /app/dist
CMD ["sh", "-c", "rm -rf /dist/* && cp -a /app/dist/. /dist/"]
