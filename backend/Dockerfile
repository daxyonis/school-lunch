FROM node:14
# Create app directory
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD [ "node", "./bin/www" ]