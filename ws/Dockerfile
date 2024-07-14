FROM node:20 AS build
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
RUN npm install -g typescript
RUN npm install
COPY . .
RUN tsc -b

FROM node:20 AS final
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
EXPOSE 8080
CMD ["node", "dist/index.js"]