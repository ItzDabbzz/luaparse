SHELL := cmd.exe

# Windows command aliases
CP = copy /Y
RM = del /F /Q
RMDIR = rmdir /S /Q
MKDIR = mkdir
CAT = type
PROCESSOR ?= C:\\Dev\\node-v22.15.0\\deps\\v8\\tools\\windows-tick-processor.bat

DOCS := docs\\*.md
LIB := .\\node_modules
BIN := $(LIB)\\.bin

all: build

# Main tasks
# ----------

build:
	$(BIN)\\gulp.cmd build

lint:
	$(BIN)\\gulp.cmd lint

.PHONY: build lint all

# Install and internal updates
# ----------------------------

install:
	pnpm install

update:
	$(CP) $(LIB)\\spec\\lib\\* test\\lib\\
	$(CP) $(LIB)\\benchmark\\benchmark.js test\\lib\\

version-bump:
	$(BIN)\\gulp.cmd version-bump
	git add luaparse.js

.PHONY: install update version-bump

# Tests
# -----

test-node:
	node test\\runner.js --console

test:
	$(BIN)\\testem.cmd ci

testem-engines:
	$(BIN)\\testem.cmd -l node,ringo,rhino,rhino1.7R5

scaffold-tests:
	for %%F in (test\\scaffolding\\*) do \
		$(MAKE) scaffold-test FILE=%%~nxF

scaffold-test:
	.\scripts\scaffold-test.cmd --name=$(FILE) ^
		test\\scaffolding\\$(FILE) ^
		> test\\spec\\$(FILE).js

.PHONY: test-node test testem-engines scaffold-tests scaffold-test

# Documentation
# -------------

docs: coverage docs-test docs-md

docs-index:
	$(BIN)\\marked.cmd README.md --gfm > tmp.html
	$(CAT) docs\\layout\\head.html tmp.html docs\\layout\\foot.html > docs\\index.html
	$(RM) tmp.html

docs-md: docs-index
	@for %%F in ($(DOCS)) do \
		$(MAKE) "%%~nF.html"

%.html: %.md
	$(BIN)\\marked.cmd $< --gfm > tmp.html
	$(CAT) docs\\layout\\head.html tmp.html docs\\layout\\foot.html > $@
	$(RM) tmp.html

.PHONY: docs docs-test docs-index

# Coverage
# --------

coverage:
	-$(RMDIR) html-report
	-$(RMDIR) docs\\coverage
	$(BIN)\\nyc.cmd --reporter=html --report-dir=docs\\coverage node test\\runner.js --console >NUL

.PHONY: coverage

# Benchmark
# ---------

benchmark:
	node C:\\Users\\Davin\\Desktop\\Projects\\FivemTools\\packages\\luaparse\\scripts\\benchmark.js -v C:\\Users\\Davin\\Desktop\\Projects\\FivemTools\\packages\\luaparse\\benchmarks\\lib\\ParseLua.lua

profile:
	.\benchmarks\run.js -v --processor $(PROCESSOR) --profile HEAD

benchmark-previous:
	.\benchmarks\run.js --js HEAD HEAD~1

.PHONY: benchmark profile benchmark-previous

# Quality Assurance
# -----------------

complexity-analysis:
	@echo ===================== Complexity analysis ============================
	node C:\\Users\\Davin\\Desktop\\Projects\\FivemTools\\packages\\luaparse\\scripts\\complexity.js 10
	$(BIN)\\cr.cmd -lws --maxcc 22 luaparse.js

coverage-analysis: coverage
	$(BIN)\\nyc.cmd check-coverage --statements 100 --branches 100 --functions 100

qa:
	$(MAKE) test lint complexity-analysis coverage-analysis

clean:
	-$(RM) docs\\*.html
	-$(RMDIR) lib-cov
	-$(RMDIR) coverage
	-$(RMDIR) html-report
	-$(RMDIR) docs\\coverage

.PHONY: complexity-analysis coverage-analysis qa clean
