---
title: "DeepSeek Harness — Runtime Sync Manifest"
description: "How .dsh derives from .skilled: hand-authored route and lineage patches, a generated skill-link farm, prompt stubs and persona patches, and what this folder never holds."
---

# DeepSeek Harness Sync Manifest

> DeepSeek Harness (`dsh`) reads no project folder by itself. A dispatch reaches this folder only through `--patch` arguments, so every file here is a composition layer the caller names explicitly.

---

## 1. OVERVIEW

DeepSeek Harness is a Node agent CLI published as `@deepseek-ai/dsh`. It composes its runtime from bundle patches, then the profile's `cordis.patch.yml`, then `$DSH_HOME/cordis.patch.yml`, then each `--patch <file>` in argv order. The last layer wins per row and replaces that row's whole `config`.

This folder holds the `--patch` layers the repository owns. Model selection belongs to the harness, so the closed roster is enforced here: one route patch per roster entry, and a lineage patch that switches off every surface a non-interactive dispatch must not run. The base default route is the official DeepSeek API, and a dispatch that names no route patch falls through to it.

---

## 2. SURFACE INVENTORY

| Surface | Mechanism | Source | Can it drift? |
|---|---|---|---|
| `patches/route-llmgateway-deepseek.patch.yml` | **hand-authored** route patch | none | Yes. `--dump-config` shows the composed `llm-pi-ai` provider and the `agent-default-model` row |
| `patches/route-opencode-go-deepseek.patch.yml` | **hand-authored** route patch | none | Yes, same check. Its endpoint is unverified until a keyed run proves it |
| `patches/lineage.patch.yml` | **hand-authored** lineage patch | none | Yes. `--dump-config` shows telemetry `DISABLED` and the four disabled rows |
| `patches/guards.patch.yml` | **hand-authored** patch that inserts the `repo-guards` row | none | Yes. A keyless boot with it must print no `did not activate` line |
| `patches/mcp-code-mode.patch.yml` | **hand-authored**, opt-in patch that mounts one `code_mode` stdio server | `.pi/mcp.json` | Yes. A keyless boot with it must leave no new `mcp-code-mode-launcher` process |
| `plugins/repo-guards/` | **hand-authored** plugin bundle; its adapters call the shared guard cores under `.skilled/` | `.skilled/hooks/`, `.skilled/skills/*/runtime/hooks/` | Yes. `node --test .dsh/plugins/repo-guards/tests/` |
| `skills/<name>` | **generated** relative symlink, one per canonical `SKILL.md`, named by its frontmatter `name` | `.skilled/skills/**/SKILL.md` | Yes. `sync-skills-dsh.cjs --check` |
| `prompts/*.md` | **generated** pointer stubs | `.skilled/commands/**/*.md` | Yes. `sync-prompts-dsh.cjs --check` |
| `agents/<name>.patch.yml` | **generated** persona patch, one `system-prompt` row whose `personaPrefix` is the agent body | `.skilled/agents/*.md` | Yes. `sync-agents-dsh.cjs --check` |
| `README.md` | hand-authored | none | No |
| `SYNC.md` | hand-authored | none | No |

### Repo-guards adapters

| Adapter | DSH event | Scope | Error policy |
|---|---|---|---|
| `dispatch-audit` | `tools/post-execute` | `bash` | Log and continue |
| `dispatch-preflight-lint` | `tools/pre-execute` | `bash` | Log and deny on core failure |
| `spec-gate-classify` | `agent/pre-step` | Latest user message | Log and continue |
| `spec-gate-enforce` | `tools/pre-execute` | `write`, `edit`, `apply_patch`, `bash` | Log and deny on core failure |
| `completion-evidence` | `agent/turn-stopping` | Current assistant turn | Log and continue |
| `task-dispatch-guard` | `tools/pre-execute` | `subagent`, `subagent_fork` | Log and continue |
| `post-edit-quality` | `tools/post-execute` | `write`, `edit`, `apply_patch` | Log and continue |
| `mcp-route-guard` | `tools/pre-execute` | `mcp__*` | Log and deny on core failure; deny `code_mode` outside `call_tool_chain`, `list_tools`, `search_tools` and `tool_info` |
| `classifier-injection-screen` | `tools/post-execute` | `web_fetch`, `web_search`, `mcp__*` | Log and continue |
| `goal-context` | `agent/created` | `DSH_SPEC_FOLDER` chat slice | Log and continue |
| `session-start-context` | `agent/created` | Session-prime output | Log and continue |
| `prompt-advisor` | `agent/pre-step` | Latest user message | Log and continue; disabled by default |
| `git-preflight-advisory` | `tools/post-execute` | Bash Git commands | Log and continue; add context |
| `git-message-gate` | `tools/pre-execute` | Bash commands covered by the message contract | Log unexpected errors and continue; deny on `ContractError` |

Four adapters remain deferred:

| Adapter | Reason |
|---|---|
| `session-compact-context` | `compaction/summary` is UNKNOWN in the source event index, which lists only `compaction/summary-error`. |
| `session-stop-context` | `agent/disposed` exists, but its source contract does not confirm session shutdown semantics. |
| `session-start-advisories` | `agent/created` exists, but the Pi implementation runs several scripts instead of one plain shared function. |
| `decision-capture` | `agent/turn-stopping` exists, but the DSH answer-channel semantics are UNKNOWN. |

dsh discovers skills at `.dsh/skills/<name>/SKILL.md`, one level deep, and follows symlinks. A single link to the whole skill tree would expose only the top-level hubs, so the generator links every skill directory on its own, and a linked skill keeps its `references/`, `assets/` and `scripts/`. dsh has no agent-file loader and no command loader. A persona reaches a run as `--patch .dsh/agents/<name>.patch.yml`, and a dispatcher composes a prompt stub into the task text, appending the user request below its last line. A `.dsh/skills/local-*` entry belongs to the operator and is ignored by git and never pruned.

The two route patches replace two rows. `llm-pi-ai` gets one custom provider with `apiKeyEnv` naming the key variable, never a key value. `agent-default-model` gets that provider, its single model and the default effort `max`. Each provider carries `compat.thinkingFormat: deepseek`, so `off` sends `thinking: {type: disabled}`, and `compat.supportsDeveloperRole: false`, because the gateway upstream refuses the `developer` role. Each model declares `off`, `high` and `max`, since a hand-declared model has no reasoning levels until the patch declares them. Whether either endpoint accepts `max` on the wire is unverified until a keyed run.

The guards patch inserts `plugins/repo-guards/index.mjs` by a path relative to the patch file, so it resolves from any dispatch cwd. A plugin that fails to load only prints `N entry did not activate` and the run carries on unguarded, so the deep-loop runner fails a lineage whose stderr holds that line. The inventory above names every shipped adapter, its error policy and the four deferred hooks with their reasons.

The MCP patch is never part of a default dispatch. A caller adds it, and the deep-loop runner adds it only for a lineage that names `code_mode` in `liveTools.mcpServers`. dsh starts the server eagerly and strips ambient variables whose names hold `KEY`, `PASSWORD`, `SECRET` or `TOKEN`, so the row names `UTCP_CONFIG_FILE` in its `env` and resolves the checkout root from its own `--patch` path. The launcher picks a Node 24 interpreter through `NVM_DIR` or `$HOME/.nvm`, so a dispatch that also replaces `HOME` must pass `NVM_DIR`. A Code Mode manual whose token variable was stripped does not register; the server still starts.

The lineage patch sets `session-telemetry-otel` to `mode: DISABLED` and disables `session-log-deepseek`, `goal-round-driver`, `command-goal` and `plan-mode`. The base bundle mounts all five. A headless dispatch has no feedback channel, a goal round driver keeps an idle agent running, and plan mode's exit tool fails closed without an interactive review.

---

## 3. WHAT THIS FOLDER NEVER HOLDS

| Kept out | Where it lives | Why |
|---|---|---|
| API keys and `.env` files | the launch environment or a disposable `$DSH_HOME/.env` | Headless reads keys from the environment, then `<cwd>/.env`, then `$DSH_HOME/.env`. A key in the repository leaks to every dispatch |
| Profiles, sessions, storages | `$DSH_HOME`, one disposable home per dispatch | The harness writes them at first boot |
| `node_modules` | the dsh installation | Bundles resolve from the installation that runs `dsh` |

Never start a dispatch from the repository root. The root holds a `.env`, and headless would read it.

---

## 4. WHEN TO SYNC

- Any `.skilled/skills/**/SKILL.md` is added, renamed or deleted, or its frontmatter `name` changes → re-run `sync-skills-dsh.cjs`. Write mode prunes stale links.
- Any `.skilled/commands/**` file is added, renamed or deleted → re-run `sync-prompts-dsh.cjs`.
- Any `.skilled/agents/*.md` changes → re-run `sync-agents-dsh.cjs`.

- A roster model id, provider endpoint or key variable changes → edit the matching route patch, then run the check in section 5.
- A shared guard core under `.skilled/hooks/` changes its exports → rerun the bundle tests.
- A new harness release renames or adds a base row → rerun the check. A patch whose target row is missing is only a loader warning, so a renamed row silently turns that patch into a no-op.

---

## 5. SYNC WORKFLOW

```bash
# Regenerate the three owned trees (write mode also prunes stale output)
node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-skills-dsh.cjs
node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-prompts-dsh.cjs
node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs

# Check without writing: exit 0 in sync, 1 on drift
node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-skills-dsh.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-prompts-dsh.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs --check
```

Then check that the patches still compose:

```bash
# Compose each route with the lineage patch, from a disposable home and a temp cwd
H=$(mktemp -d); W=$(mktemp -d); R="$PWD/.dsh/patches"
(cd "$W" && DSH_HOME="$H" dsh --profile headless \
  --patch "$R/route-llmgateway-deepseek.patch.yml" \
  --patch "$R/lineage.patch.yml" --dump-config </dev/null)
```

Expected result: exit 0, empty stderr, `agent-default-model` naming `llmgateway` and `deepseek-v4.1-flash-1017`, and `mode: DISABLED` under `session-telemetry-otel`. Repeat with `route-opencode-go-deepseek.patch.yml`, which names `opencode-go` and `deepseek-v4.1-flash`. Any stderr line about an unmatched patch target is a failure.
