UV ?= uv
UV_TOOL_BIN := $(shell $(UV) tool dir --bin)

.PHONY: install test build check

embed-skills:
	python3 scripts/embed_skills.py

install: embed-skills
	@command -v "$(UV)" >/dev/null || { echo "uv is required: https://docs.astral.sh/uv/" >&2; exit 1; }
	$(UV) tool install --force --link-mode copy .
	"$(UV_TOOL_BIN)/jev" --version

test: embed-skills
	$(UV) run --python 3.13 -m unittest discover -s tests -v

build: embed-skills
	$(UV) run python -c "import shutil; shutil.rmtree('dist', ignore_errors=True)"
	$(UV) build

check: test build
