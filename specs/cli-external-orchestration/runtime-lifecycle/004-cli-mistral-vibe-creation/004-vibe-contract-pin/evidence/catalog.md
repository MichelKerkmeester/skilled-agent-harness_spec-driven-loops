# Catalog check: roster ids with no hand-written model row (vibe 3.1.2)

Each run: fresh empty `VIBE_HOME` (no `config.toml`), temp cwd, `vibe -p "<prompt>" --model <id> --output-dir <dir> </dev/null`.

| Id | Exit | First stderr line |
|----|------|-------------------|
| deepseek-v4-1-flash-1017 | 1 | `Error: Unknown model: deepseek-v4-1-flash-1017. Available: mistral-medium-3.5` |
| zai-glm-5-3-flash | 1 | `Error: Unknown model: zai-glm-5-3-flash. Available: mistral-medium-3.5` |

Both `export.json` records show `outcome: usage_error`. Neither roster id is usable without a hand-written `[[models]]` row.

A run whose `config.toml` does carry hand-written rows records two extra built-in rows in its `export.json` config: `mistral-vibe-cli-latest` (alias `mistral-medium-3.5`, thinking `high`) and `zai-glm-5-3-flash-vibe-free` (alias `zai-glm-5-3-flash`, thinking `high`), see `export.json`. The free GLM row is not selectable: with the repository's rows in place, `--model zai-glm-5-3-flash` exits 1 with `Error: Unknown model: zai-glm-5-3-flash. Available: deepseek-flash, glm-flash, mistral-medium-3.5`. So the selectable set is the hand-written aliases plus `mistral-medium-3.5`. Closing it to the roster takes `allowed_models` per the research; that key is not tested here.
