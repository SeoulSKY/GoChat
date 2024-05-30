FROM golang:1.22.3

ENV DOCKER 1

WORKDIR /app

COPY . .

RUN go build -o main

CMD ["./main"]
