##############################################################################
# Run:
#    make
#    make start
#
# Go to:
#
#     http://localhost:3000
#
# Cypress:
#
#    make cypress-open
#
##############################################################################
# SETUP MAKE
#
## Defensive settings for make: https://tech.davis-hansson.com/p/make/
SHELL:=bash
.ONESHELL:
# for Makefile debugging purposes add -x to the .SHELLFLAGS
.SHELLFLAGS:=-eu -o pipefail -O inherit_errexit -c
.SILENT:
.DELETE_ON_ERROR:
MAKEFLAGS+=--warn-undefined-variables
MAKEFLAGS+=--no-builtin-rules

# Colors
# OK=Green, warn=yellow, error=red
ifeq ($(TERM),)
# no colors if not in terminal
        MARK_COLOR=
        OK_COLOR=
        WARN_COLOR=
        ERROR_COLOR=
        NO_COLOR=
else
        MARK_COLOR=`tput setaf 6`
        OK_COLOR=`tput setaf 2`
        WARN_COLOR=`tput setaf 3`
        ERROR_COLOR=`tput setaf 1`
        NO_COLOR=`tput sgr0`
endif

##############################################################################
# SETTINGS AND VARIABLE
DIR=$(shell basename "$$(pwd)")
PLONE_VERSION?=6
VOLTO_VERSION?=19
ADDON_PATH?=${DIR}
ADDON_NAME?=$(shell node -p "require('./package.json').name")
DOCKER_COMPOSE=PLONE_VERSION=${PLONE_VERSION} VOLTO_VERSION=${VOLTO_VERSION} ADDON_NAME=${ADDON_NAME} ADDON_PATH=${ADDON_PATH} docker compose
RAZZLE_INTERNAL_API_PATH?="http://localhost:8080/Plone"
RAZZLE_DEV_PROXY_API_PATH?="${RAZZLE_INTERNAL_API_PATH}"
CYPRESS_API_PATH="${RAZZLE_DEV_PROXY_API_PATH}"



# Top-level targets
.PHONY: all
all: clean install

.PHONY: clean
clean:			## Cleanup development environment
	${DOCKER_COMPOSE} down --volumes --remove-orphans

.PHONY: install
install:		## Build and install development environment
	echo "Running:	${DOCKER_COMPOSE} build"
	${DOCKER_COMPOSE} pull
	${DOCKER_COMPOSE} build

.PHONY: start
start:			## Start development environment
	echo "Running:	${DOCKER_COMPOSE} up"
	${DOCKER_COMPOSE} up

.PHONY: shell
shell:			## Start a shell in the frontend container
	echo "Running:	${DOCKER_COMPOSE} run frontend bash"
	${DOCKER_COMPOSE} run --entrypoint=bash frontend

.PHONY: cypress-open
cypress-open:		## Open cypress integration tests
	CYPRESS_API_PATH="${RAZZLE_DEV_PROXY_API_PATH}" NODE_ENV=development  pnpm exec cypress open

.PHONY: cypress-run
cypress-run:	## Run cypress integration tests
	CYPRESS_API_PATH="${RAZZLE_DEV_PROXY_API_PATH}" NODE_ENV=development  pnpm exec cypress run

.PHONY: test
test:			## Run Vitest tests
	${DOCKER_COMPOSE} run --no-deps -e CI=1 frontend test

.PHONY: test-update
test-update:	## Update Vitest snapshots
	${DOCKER_COMPOSE} run --no-deps -e CI=1 frontend test -u

.PHONY: stylelint
stylelint:		## Stylelint
	pnpm exec stylelint --allow-empty-input 'src/**/*.{css,less}'

.PHONY: stylelint-overrides
stylelint-overrides:
	pnpm exec stylelint --custom-syntax less --allow-empty-input 'theme/**/*.overrides' 'src/**/*.overrides'

.PHONY: stylelint-fix
stylelint-fix:	## Fix stylelint
	pnpm exec stylelint --allow-empty-input 'src/**/*.{css,less}' --fix
	pnpm exec stylelint --custom-syntax less --allow-empty-input 'theme/**/*.overrides' 'src/**/*.overrides' --fix

.PHONY: prettier
prettier:		## Prettier
	pnpm exec prettier --single-quote --check 'src/**/*.{js,jsx,json,css,less,md}'

.PHONY: prettier-fix
prettier-fix:	## Fix prettier
	pnpm exec prettier --single-quote  --write 'src/**/*.{js,jsx,json,css,less,md}'

.PHONY: lint
lint:			## ES Lint
	pnpm exec eslint --max-warnings=0 'src/**/*.{js,jsx}'

.PHONY: lint-fix
lint-fix:		## Fix ES Lint
	pnpm exec eslint --fix 'src/**/*.{js,jsx}'

.PHONY: i18n
i18n:			## i18n
	rm -rf build/messages
	NODE_ENV=development pnpm exec i18n --addon

.PHONY: help
help:                   ## Show this help.
	@echo -e "$$(grep -hE '^\S+:.*##' $(MAKEFILE_LIST) | sed -e 's/:.*##\s*/:/' -e 's/^\(.\+\):\(.*\)/\\x1b[36m\1\\x1b[m:\2/' | column -c2 -t -s :)"
	head -n 14 Makefile

.PHONY: ci-fix
ci-fix:
	echo "Running lint-fix"
	make lint-fix
	echo "Running prettier-fix"
	make prettier-fix
	echo "Running stylelint-fix"
	make stylelint-fix

.PHONY: test-ci
test-ci:
	CI=true pnpm --dir /app --filter ${ADDON_NAME} run test --coverage --coverage.reportsDirectory=/app/coverage --reporter=default --reporter=junit --outputFile.junit=/app/junit.xml

.PHONY: start-ci
start-ci:
	cp .coverage.babel.config.js /app/babel.config.js
	pnpm --dir /app start

.PHONY: check-ci
check-ci:
	pnpm --dir /app --filter @plone/volto exec wait-on -t 240000 http://localhost:3000

.PHONY: cypress-ci
cypress-ci:
	pnpm --dir /app --filter @plone/volto exec wait-on -t 240000 http://localhost:3000
	CYPRESS_API_PATH="${RAZZLE_DEV_PROXY_API_PATH}" NODE_ENV=development pnpm exec cypress run --browser chromium
