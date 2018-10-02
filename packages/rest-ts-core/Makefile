NODE_MODULES=node_modules/.makets
BIN=dist/index.js
SRC=$(shell find src -type f -name '*.ts')

.PHONY: build
build: $(BIN)

$(BIN): $(NODE_MODULES) $(SRC)
	npm run build

$(NODE_MODULES): package-lock.json package.json
	make -C ../.. bootstrap
	touch node_modules/.makets
