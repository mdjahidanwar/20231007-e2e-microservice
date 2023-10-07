FROM node:14-alpine AS build_stage
RUN mkdir -p /admin/app
WORKDIR /admin/app
COPY package*.json /admin/app/
COPY . ./
RUN npm install
#EXPOSE 3000
RUN npm rebuild node-sass
RUN npm run build

FROM nginx:alpine
COPY --from=build_stage /admin/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off"]
