
NODE_MODULES=node_modules/.makets

PACKAGES=$(wildcard packages/*)
TASKS=build lint publish

publish: pre-publish-check

packages/rest-ts-express: packages/rest-ts-core
packages/rest-ts-axios: packages/rest-ts-core
test/e2e-runtypes: packages/rest-ts-express packages/rest-ts-axios
test/e2e-vanilla: packages/rest-ts-express packages/rest-ts-axios

pre-publish-check:
	if [ -z "$$TRAVIS" ]; then echo "The publish task may only run in travis. Did you mean 'release'?" && exit 1; fi

.PHONY: release
release:
	npm run release

.PHONY: test
test: $(NODE_MODULES)
	$(MAKE) build
	npm test

$(NODE_MODULES): package.json package-lock.json
	npm install
	touch node_modules/.makets

# Dispatches the tasks accross all packages

.PHONY: $(TASKS)
$(TASKS): $(PACKAGES)

.PHONY: $(PACKAGES)
$(PACKAGES):
	$(MAKE) -C $@ $(MAKECMDGOALS)
