# allowed_models matches model names, not aliases (vibe 3.1.2)

Each run: fresh `VIBE_HOME` whose `config.toml` holds the two roster rows plus the `allowed_models` line shown, temp cwd, `vibe -p "<prompt>" --model <alias> --output-dir <dir> </dev/null`. Verdict from `export.json`.

| allowed_models | --model | exit / outcome | First stderr line |
|---|---|---|---|
| `["deepseek-flash", "glm-flash"]` (aliases) | deepseek-flash | 0 finished | `Allowed model 'deepseek-flash' matches none of your configured models.` |
| `["deepseek-flash", "glm-flash"]` (aliases) | mistral-medium-3.5 | 0 finished | same warning: nothing is closed |
| `["deepseek-v4-1-flash-1017", "zai-glm-5-3-flash"]` (names) | deepseek-flash | 0 finished | none |
| `["deepseek-v4-1-flash-1017", "zai-glm-5-3-flash"]` (names) | glm-flash | 0 finished | none |
| `["deepseek-v4-1-flash-1017", "zai-glm-5-3-flash"]` (names) | mistral-medium-3.5 | 1 usage_error | `Error: This configuration runs deepseek-flash, so mistral-medium-3.5 cannot be picked for one session` |

The schema text, "An explicit list of model names/patterns to allow", means the row's `name`. An alias list only warns and leaves every configured model selectable, `mistral-medium-3.5` included. The repository config therefore lists the two model names.
