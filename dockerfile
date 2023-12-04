FROM node:14

WORKDIR ../NodeJS-API/

COPY package*.json ./

RUN npm install

RUN npm install @babel/core @babel/node @babel/plugin-proposal-export-default-from @babel/preset-env babel-loader babel-polyfill

COPY . .

ARG MONGO_URL
ARG NODE_ENV
ARG PORT
ARG JWT_SECRET
ARG DB_PASSWORD
ARG DB_USER

ENV MONGO_URL ${MONGO_URL}
ENV NODE_ENV ${NODE_ENV}
ENV PORT ${PORT}
ENV JWT_SECRET ${JWT_SECRET}
ENV DB_PASSWORD ${DB_PASSWORD}
ENV DB_USER ${DB_USER}

EXPOSE 90

CMD ["npx", "babel-node", "index.js"]
