NODE_MODULES=node_modules/.makets
BIN=dist/index.js
SRC=$(shell find src -type f -name '*.ts')

.PHONY: build
build: $(BIN)

.PHONY: lint
lint:
	npm run tslint -- -p .

$(BIN): $(NODE_MODULES) $(SRC)
	npm run tsc

$(NODE_MODULES): package-lock.json package.json
	npm install
	touch node_modules/.makets
