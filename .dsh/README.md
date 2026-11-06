---
title: "DeepSeek Harness runtime folder"
description: "The repository's DeepSeek Harness runtime folder: roster route patches, the lineage, guards and MCP patches, the repo-guards bundle, generated skill links, prompt stubs and persona patches."
trigger_phrases:
  - "dsh runtime folder"
  - "deepseek harness patches"
---

# DeepSeek Harness Runtime Folder

> The patch files and guard bundle that a DeepSeek Harness (`dsh`) run from this repository composes, whether it is a headless dispatch or an interactive session.

---

## 1. OVERVIEW

`dsh` reads this folder only when a run names its files with `--patch`. A dispatch passes exactly one route patch, the lineage patch and the guards patch. The route patch picks the provider and model. The lineage patch turns off telemetry export, the DeepSeek session log, goal rounds and plan mode, and inserts a marker row that keeps the bundle's four interactive-only adapters off in a fan-out leaf.

An interactive session, such as `dsh web`, takes the guards patch without the lineage patch. It then also gets the skill-advisor brief, `/goal-dsh` with the `dsh_goal` tool, the six session-start checks and the autosave at session close. Every other guard runs in both compositions.

The `cli-deepseek-harness` mode packet under `.skilled/skills/cli-external-orchestration/` owns the dispatch contract and its hard rules. [SYNC.md](./SYNC.md) owns the inventory and the drift check.

---

## 2. STRUCTURE

| Path | Purpose |
|---|---|
| `patches/route-llmgateway-deepseek.patch.yml` | Routes to LLM Gateway, model `deepseek-v4.1-flash-1017`, key variable `LLMGATEWAY_API_KEY` |
| `patches/route-opencode-go-deepseek.patch.yml` | Routes to OpenCode Go, model `deepseek-v4.1-flash`, key variable `OPENCODE_API_KEY`. Endpoint unverified |
| `patches/lineage.patch.yml` | Disables telemetry export, `session-log-deepseek`, `goal-round-driver`, `command-goal` and `plan-mode`, and inserts the `repo-guards-lineage-leaf` marker row |
| `patches/guards.patch.yml` | Loads the required repo-guards bundle for every run and turns its skill advisor on |
| `patches/mcp-code-mode.patch.yml` | Mounts the `code_mode` MCP server over stdio. MCP is opt-in, so a run sees it only when it adds this patch |
| `plugins/repo-guards/` | The bundle the guards patch loads: 20 adapters as links into the hook library, the leaf marker plugin and the tests. See its [README](./plugins/repo-guards/README.md) |
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
