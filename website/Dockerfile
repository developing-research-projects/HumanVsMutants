FROM node:21.7.3-alpine3.20

RUN apk update && apk add --no-cache git nano

WORKDIR /home/user

COPY ./backend /home/user/backend
COPY ./frontend /home/user/frontend

ENV PATH /home/user/backend/bin:$PATH

# The command can be overridden by docker-compose.yml
CMD ["/bin/sh"]
