NODE_MODULES=node_modules/.makets
BIN=dist/index.js
SRC=$(shell find src -type f -name '*.ts')

.PHONY: build
build: $(BIN)

.PHONY: lint
lint:
	../../node_modules/.bin/tslint -p .

$(BIN): $(NODE_MODULES) $(SRC) tsconfig.json
	../../node_modules/.bin/tsc -p .

$(NODE_MODULES): package-lock.json package.json
	npm install
	touch node_modules/.makets
