FROM golang:1.21-alpine AS builder

WORKDIR /app

# Go mod files をコピー
COPY go.mod go.sum ./
RUN go mod download

# ソースコードをコピー
COPY . .

# Linux AMD64用にクロスコンパイル
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -installsuffix cgo -o main .

# 実行用の軽量イメージ
FROM alpine:latest

RUN apk --no-cache add ca-certificates
WORKDIR /root/

# ビルドしたバイナリをコピー
COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]