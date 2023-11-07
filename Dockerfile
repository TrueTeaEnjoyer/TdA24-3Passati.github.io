FROM node: .NET-windows
WORKDIR /index.html
ARG VERSION
ENV VERSION = $VERSION
RUN npm install
ENTRYPOINT npm start
EXPOSE 80
