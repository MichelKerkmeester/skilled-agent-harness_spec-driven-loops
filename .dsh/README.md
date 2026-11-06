---
title: "DeepSeek Harness runtime folder"
description: "The repository's DeepSeek Harness runtime folder: roster route patches, a lineage patch, generated skill links, prompt stubs and persona patches."
trigger_phrases:
  - "dsh runtime folder"
  - "deepseek harness patches"
---

# DeepSeek Harness Runtime Folder

> The patch files every DeepSeek Harness (`dsh`) headless dispatch from this repository composes.

---

## 1. OVERVIEW

`dsh` reads this folder only when a dispatch names its files with `--patch`. A dispatch passes exactly one route patch, the lineage patch and the guards patch. The route patch picks the provider and model. The lineage patch turns off telemetry export, the DeepSeek session log, goal rounds and plan mode.

The `cli-deepseek-harness` mode packet under `.skilled/skills/cli-external-orchestration/` owns the dispatch contract and its hard rules. [SYNC.md](./SYNC.md) owns the inventory and the drift check.

---

## 2. STRUCTURE

| Path | Purpose |
|---|---|
| `patches/route-llmgateway-deepseek.patch.yml` | Routes to LLM Gateway, model `deepseek-v4.1-flash-1017`, key variable `LLMGATEWAY_API_KEY` |
| `patches/route-opencode-go-deepseek.patch.yml` | Routes to OpenCode Go, model `deepseek-v4.1-flash`, key variable `OPENCODE_API_KEY`. Endpoint unverified |
| `patches/lineage.patch.yml` | Disables telemetry export, `session-log-deepseek`, `goal-round-driver`, `command-goal` and `plan-mode` |
| `patches/guards.patch.yml` | Loads the required repo-guards plugin for every dispatch |
| `plugins/repo-guards/` | Guard adapters and tests, activated by `patches/guards.patch.yml` |
| `skills/` | Generated relative symlinks, one per canonical skill, which dsh discovers natively |
| `prompts/` | Generated pointer stubs, one per command, composed into a dispatch's task text |
| `agents/` | Generated persona patches, passed as `--patch .dsh/agents/<name>.patch.yml` |
| `SYNC.md` | Surface inventory, generators, what stays out of this folder and the drift checks |

---

## 3. USAGE EXAMPLES

Run from a temp working directory with a disposable home, never from the repository root:

```bash
REPO="$(pwd -P)"
H=$(mktemp -d); W=$(mktemp -d)
cd "$W" && printf 'Reply with the single word OK' | DSH_HOME="$H" dsh --profile headless \
  --patch "$REPO/.dsh/patches/route-llmgateway-deepseek.patch.yml" \
  --patch "$REPO/.dsh/patches/lineage.patch.yml" \
  --patch "$REPO/.dsh/patches/guards.patch.yml" \
  --json --permission-mode read-only --approval-policy never -
```

The last stdout line is a `final` event. Exit 0 with `final.reason.kind` `completed` is success. With no key in the environment the run exits 1 and the `final` event carries `MISSING_CREDENTIAL` for the named route.

---

## 4. RELATED RESOURCES

- [SYNC.md](./SYNC.md): surface inventory and drift check.
- `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/`: the mode packet and its hard rules.
