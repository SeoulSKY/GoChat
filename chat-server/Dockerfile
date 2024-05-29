FROM golang:1.22.3

ENV DOCKER 1

WORKDIR /app

COPY . .

RUN go get

CMD ["go", "run", "."]
