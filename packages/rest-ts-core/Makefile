NODE_MODULES=node_modules/.makets
BIN=dist/index.js
SRC=$(shell find src -type f -name '*.ts')

.PHONY: build
build: $(BIN)

.PHONY: test
test: lint lint-src lint-test check-test

.PHONY: lint
lint: 

.PHONY: lint-src
lint-src:
	npm run tslint -- -p .

.PHONY: lint-test
lint-test:
	npm run tslint -- -p test

.PHONY: check-test
check-test:
	npm run tsc -- -p test

$(BIN): $(NODE_MODULES) $(SRC)
	npm run tsc

$(NODE_MODULES): package-lock.json package.json
	make -C ../.. bootstrap
	touch node_modules/.makets

