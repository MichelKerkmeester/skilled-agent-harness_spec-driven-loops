# Applying the repository .vibe/config.toml from a subdirectory (vibe 3.1.2)

Cwd: this packet's `scratch/`, a subdirectory of the checkout. Fresh `VIBE_HOME` per run. Verdict from `export.json`.

| Trust given | `allowed_models` in export | `--model mistral-medium-3.5` |
|---|---|---|
| `--trust` only | `[]`: the repository config was ignored | `finished`: not closed |
| `$VIBE_HOME/trusted_folders.toml` with `trusted = ["<checkout root>"]` | `["deepseek-v4-1-flash-1017","zai-glm-5-3-flash"]` | exit 1 `usage_error` |

With the seeded trust file, `VIBE_STRICT_CONFIG=1` loads the config with exit 0, and `--model glm-flash` finishes.

Why `--trust` alone fails: discovery walks up and finds `<root>/.vibe/config.toml`, but `_check_trust` asks whether that file's own folder is trusted (`vibe/core/config/layers/project.py`, `_check_trust`), and the trust store walks upward from the asked path (`vibe/core/trusted_folders.py`, `trust_status`). `--trust` trusts the subdirectory, which never covers its parent. So a dispatch that must apply the repository config writes the checkout root into the disposable home's `trusted_folders.toml`.
