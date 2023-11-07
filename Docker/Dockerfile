FROM nginx:latest
WORKDIR /.index.html
ARG VERSION
ENV VERSION = $VERSION
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 80