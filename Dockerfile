FROM node as node-builder
WORKDIR /StockMarket

#build the angular app
COPY . .
RUN npm install
RUN npm run build

FROM nginx
# copy from dist to nginx root dir，
COPY --from=node-builder /StockMarket/dist/StockMarket /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./nginx-angular.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
