FROM node: mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /index.html
ARG VERSION
ENV VERSION = $VERSION
RUN npm install
ENTRYPOINT npm start
EXPOSE 80