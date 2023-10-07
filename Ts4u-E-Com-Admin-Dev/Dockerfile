FROM node:14-alpine 
RUN mkdir -p /admin/app
WORKDIR /admin/app
COPY . .
RUN npm install
RUN npm build
EXPOSE 3000
CMD "npm" "start"
