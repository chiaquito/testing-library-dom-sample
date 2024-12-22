FROM node:alpine3.20

COPY . /
EXPOSE 3000
RUN npm ci 
CMD ["node", "index.js"]