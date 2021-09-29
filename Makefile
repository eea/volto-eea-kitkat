SHELL=/bin/bash

DIR=$(shell basename $$(pwd))
ADDON ?= "@eeacms/volto-eea-kitkat"

# We like colors
# From: https://coderwall.com/p/izxssa/colored-makefile-for-golang-projects
RED=`tput setaf 1`
GREEN=`tput setaf 2`
RESET=`tput sgr0`
YELLOW=`tput setaf 3`

project:
	npm install -g yo
	npm install -g @plone/generator-volto
	npm install -g mrs-developer
	yo @plone/volto project --addon ${ADDON} --workspace "src/addons/${DIR}" --no-interactive
	ln -sf $$(pwd) project/src/addons/
	cp .project.eslintrc.js .eslintrc.js
	cd project && yarn
	@echo "-------------------"
	@echo "$(GREEN)Volto project is ready!$(RESET)"
	@echo "$(RED)Now run: cd project && yarn start$(RESET)"

all: project

.PHONY: start-test-backend
start-test-backend: ## Start Test Plone Backend
	@echo "$(GREEN)==> Start Test Plone Backend$(RESET)"
	docker run -i --rm -e ZSERVER_HOST=0.0.0.0 -e ZSERVER_PORT=55001 -p 55001:55001 -e SITE=plone -e APPLY_PROFILES=plone.app.contenttypes:plone-content,plone.restapi:default,kitconcept.volto:default-homepage -e CONFIGURE_PACKAGES=plone.app.contenttypes,plone.restapi,kitconcept.volto,kitconcept.volto.cors -e ADDONS='plone.app.robotframework plone.app.contenttypes plone.restapi kitconcept.volto' plone ./bin/robot-server plone.app.robotframework.testing.PLONE_ROBOT_TESTING

.PHONY: start-docker-backend
start-docker-backend:
	@echo "$(GREEN)==> Start Plone Backend$(RESET)"
	docker pull plone
	docker run -it --rm -e SITE="Plone" -e ADDONS="eea.schema.slate" -e VERSIONS="plone.schema=1.3.0 plone.restapi=8.9.1" -e PROFILES="profile-plone.restapi:blocks" -p 8080:8080 plone fg

.PHONY: test
test:
	docker pull plone/volto-addon-ci
	docker run -it --rm -e NAMESPACE="@eeacms" -e GIT_NAME="${DIR}" -e RAZZLE_JEST_CONFIG=jest-addon.config.js -v "$$(pwd):/opt/frontend/my-volto-project/src/addons/${DIR}" plone/volto-addon-ci yarn test --watchAll=false

.PHONY: test-update
test-update:
	docker pull plone/volto-addon-ci
	docker run -it --rm -e NAMESPACE="@eeacms" -e GIT_NAME="${DIR}" -e RAZZLE_JEST_CONFIG=jest-addon.config.js -v "$$(pwd):/opt/frontend/my-volto-project/src/addons/${DIR}" plone/volto-addon-ci yarn test --watchAll=false -u

.PHONY: help
help:		## Show this help.
	@echo -e "$$(grep -hE '^\S+:.*##' $(MAKEFILE_LIST) | sed -e 's/:.*##\s*/:/' -e 's/^\(.\+\):\(.*\)/\\x1b[36m\1\\x1b[m:\2/' | column -c2 -t -s :)"
