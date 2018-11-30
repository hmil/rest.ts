
NODE_MODULES=node_modules/.makets
LERNA=node_modules/.bin/lerna

PACKAGES=$(wildcard packages/*)
TASKS=build lint

packages/rest-ts-express: packages/rest-ts-core
packages/rest-ts-axios: packages/rest-ts-core

bootstrap: $(NODE_MODULES)
	$(LERNA) bootstrap

$(NODE_MODULES): package.json package-lock.json
	npm ci
	touch node_modules/.makets

# Dispatches the tasks accross all packages

.PHONY: $(TASKS)
$(TASKS): $(PACKAGES)

.PHONY: $(PACKAGES)
$(PACKAGES):
	$(MAKE) -C $@ $(MAKECMDGOALS)
