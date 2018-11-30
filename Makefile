
NODE_MODULES=node_modules/.makets

PACKAGES=$(wildcard packages/*)
TASKS=build lint

packages/rest-ts-express: packages/rest-ts-core
packages/rest-ts-axios: packages/rest-ts-core
test/e2e-runtypes: packages/rest-ts-express packages/rest-ts-axios
test/e2e-vanilla: packages/rest-ts-express packages/rest-ts-axios

$(NODE_MODULES): package.json package-lock.json
	npm ci
	touch node_modules/.makets

# Dispatches the tasks accross all packages

.PHONY: $(TASKS)
$(TASKS): $(PACKAGES)

.PHONY: $(PACKAGES)
$(PACKAGES):
	$(MAKE) -C $@ $(MAKECMDGOALS)
