NODE_MODULES=node_modules/.makets
BIN=dist/index.js
SRC=$(shell find src -type f -name '*.ts')

.PHONY: build
build: $(BIN)

.PHONY: lint
lint:
	../../node_modules/.bin/tslint -p .

$(BIN): $(SRC)
	../../node_modules/.bin/tsc -p .

