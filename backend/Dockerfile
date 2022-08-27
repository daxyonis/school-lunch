FROM node:14-alpine
RUN apk add dumb-init
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --chown=node:node . /usr/src/app
RUN npm ci --only=production
USER node
EXPOSE 3000
CMD ["dumb-init", "node", "./bin/www"]