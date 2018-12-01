NODE_MODULES=node_modules/.makets
BIN=dist/index.js
SRC=$(shell find src -type f -name '*.ts')

.PHONY: build
build: $(BIN)

.PHONY: lint
lint:
	../../node_modules/.bin/tslint -p .

$(BIN): $(SRC) $(NODE_MODULES)
	../../node_modules/.bin/tsc -p .

$(NODE_MODULES): package.json package-lock.json
	npm install
	touch node_modules/.makets
