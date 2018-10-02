
NODE_MODULES=node_modules/.makets
LERNA=node_modules/.bin/lerna

.phony: build
build: $(NODE_MODULES)
	$(LERNA) exec make build

bootstrap: $(NODE_MODULES)
	$(LERNA) bootstrap

$(NODE_MODULES): package.json package-lock.json
	npm ci
	touch node_modules/.makets