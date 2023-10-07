FROM node:14-alpine 
WORKDIR /admin-app
COPY . .
RUN npm install
RUN npm build
CMD ["npm","start"]
