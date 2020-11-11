FROM node:14-alpine AS frontend

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN yarn install

COPY frontend ./

RUN yarn build



FROM node:14-alpine AS backend

ENV NODE_ENV=production

WORKDIR /app/backend


COPY backend/package*.json ./
RUN yarn install --production


COPY --from=frontend /app/frontend/build ../frontend/build
COPY backend ./

RUN ls -lah

CMD ["node", "app.js"]

EXPOSE 3000
