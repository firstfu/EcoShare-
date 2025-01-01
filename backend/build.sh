#!/bin/bash

# 設置 Go 環境變數
export GO111MODULE=on
export GOOS=linux  # 或 windows、darwin，依據目標平台
export GOARCH=amd64

# 建構專案
go build -o bin/ecoshare cmd/api/main.go