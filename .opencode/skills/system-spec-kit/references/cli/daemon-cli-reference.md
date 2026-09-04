---
title: Daemon CLI Reference
description: The daemon-backed CLI shims, their warm-only policy, exit-code taxonomy, and when to use CLI transport instead of MCP.
trigger_phrases:
  - "daemon cli reference"
  - "daemon-backed cli shims"
  - "warm-only policy"
  - "exit code taxonomy"
  - "cli vs mcp transport"
importance_tier: important
contextType: implementation
version: 3.6.0.8
---

# Daemon CLI Reference

The daemon CLI shim is an additive IPC client over the skill-advisor MCP daemon. It is not a replacement server, and MCP remains the primary in-session transport.

Use these CLIs when a runtime MCP transport is missing, failed, or not reconnecting while the daemon is expected to be warm, or when an operator needs shell diagnostics, CI checks, or scripted maintenance.

Run the repo-relative examples from the repository root. If the caller is in another working directory, use an absolute path to the selected `.opencode/bin/*.cjs` shim instead.

## 1. OVERVIEW

The skill-advisor daemon exposes a CLI front door over the same tool surface its MCP transport serves. This reference covers that surface, the invocation forms, the output and exit-code contracts, the warm-only policy, and the recovery path when a stale build refuses to run. It is the operator's map; the MCP transport remains the runtimes' route.

---

## 2. CLI SURFACES

| CLI shim | MCP daemon | Tool count | Primary use |
| --- | --- | ---: | --- |
| `node .opencode/bin/skill-advisor.cjs` | `system_skill_advisor` | 9 | Advisor recommendations, advisor health, skill graph diagnostics, and trusted maintainer mutations. |

The shim first sets a default socket directory when needed, checks its built CLI entrypoint for freshness, then runs the compiled CLI with inherited stdio. `list-tools` and `--help` are served from local definitions and do not contact or spawn a daemon.

The skill-advisor launcher mirrors child exit or signal state and expects the owning runtime or operator to restart it after a child crash.

Spec-folder retrieval has no CLI on this page and no daemon behind it. It is two committed scripts under `system-spec-kit/scripts/retrieval/` plus the ripgrep recipes in `../retrieval/retrieval-conventions.md`, and none of the exit codes, warm-only rules or recovery steps below apply to it.

### CLI Versus MCP: When To Use Which


Because the CLI already uses the same daemon IPC path and exposes a stable count-locked surface, a later evolution could make it the primary or sole transport, replacing the MCP server without breaking existing MCP workflows. Treat that as a possible direction, not a committed migration plan.

---

## 3. INVOCATION FORMS

Common form:

```bash
node .opencode/bin/<cli>.cjs list-tools [--format json|text|jsonl] [--compact|--names-only]
node .opencode/bin/<cli>.cjs completion bash|zsh
node .opencode/bin/<cli>.cjs <tool_name> [--json '{...}'] [--format json|text|jsonl] [--timeout-ms N] [--warm-only]
node .opencode/bin/<cli>.cjs <tool_name> --param value [--another-param value]
node .opencode/bin/<cli>.cjs <tool_name> --help
```

`list-tools --compact` returns names, aliases, descriptions, and counts only; it omits all `inputSchema` fields.

`list-tools --names-only` returns canonical tool names and counts only; it omits all `inputSchema` fields.

`completion bash|zsh` emits generated shell completion for the selected CLI and shell.

Tool names accept the aliases exposed by the CLI: snake_case, kebab-case, and camelCase, read from the tool manifest.

Use `--json` for one complete JSON object argument when a tool has structured input:

```bash
node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"implement cli core"}' --format json --timeout-ms 3000 --warm-only
```

---

## 4. OUTPUT FORMATS

The CLI accepts `--format json|text|jsonl`.

| Format | Behavior |
| --- | --- |
| `json` | Pretty-printed JSON payload. |
| `text` | Human-readable summary when the payload has one; `list-tools --format text` prints tool names. |
| `jsonl` | A single complete JSON payload rendered on one stdout line. |

`jsonl` is not streaming JSON Lines. Do not assume one record per tool, one record per result, or incremental output. When passing input with `--json`, pass one complete JSON object as one shell argument; the CLI does not parse a stream of JSONL records from stdin.

---

## 5. EXIT-CODE TAXONOMY

| Exit | Meaning | Notes |
| ---: | --- | --- |
| `0` | Success | The requested tool or discovery operation completed. |
| `1` | Runtime error | Tool returned an error payload or an unclassified runtime failure occurred. |
| `64` | Usage or schema error | Bad flags, invalid `--json`, schema validation failure, or advisor trusted-mutation refusal. |
| `69` | Protocol mismatch or stale/missing dist | The shim or CLI refused an unsafe build/protocol state. Rebuild the matching package before retrying. |
| `75` | Retryable daemon/IPC error | Warm-only daemon unavailable, connection refused/reset, timeout, busy database, spawn failure, or retryable backend state. |

Exit `75` is retryable. Treat it as daemon or IPC unavailability, not as user input failure.

---

## 6. WARM-ONLY POLICY

Prompt-time hooks and prompt-time runtime fallbacks must use warm-only behavior. Warm-only probes the daemon socket and exits `75` when the daemon is cold instead of cold-spawning it.

Use either the explicit flag or the prompt-time env flags:

```bash
node .opencode/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --warm-only --format json --timeout-ms 3000
```

Warm-only defaults can also come from env flags documented in `../config/environment-variables.md` and `../../runtime/ENV-REFERENCE.md`: per-CLI `*_CLI_WARM_ONLY`, per-CLI `*_CLI_PROMPT_TIME`, cross-CLI `SPECKIT_CLI_PROMPT_TIME`, and runtime prompt-time markers such as `OPENCODE_PROMPT_TIME`, `OPENCODE_PROMPT_TIME`, and `CLAUDE_CODE_PROMPT_TIME`.

Non-prompt contexts such as explicit operator maintenance, CI, cron, or session startup may omit `--warm-only`; then a cold daemon can auto-spawn through the matching `mk-*-launcher.cjs`.

---

## 7. EXIT 69 RECOVERY

The shim refuses a stale or missing dist entrypoint with exit `69`. Rebuild before retrying.

| CLI | Shim stale/missing message | Build recovery |
| --- | --- | --- |
| `skill-advisor.cjs` | `Run the skill-advisor TypeScript build.` | `npm --prefix .opencode/skills/system-skill-advisor/mcp-server run build` |

A development-only stale override exists for local loops, but should not be used in normal recovery: `SYSTEM_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE=1` or `SPECKIT_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE=1`.

---

## 8. HELP AND DISCOVERY

Use `list-tools` for offline surface discovery:

```bash
node .opencode/bin/skill-advisor.cjs list-tools --format json
node .opencode/bin/skill-advisor.cjs list-tools --compact
node .opencode/bin/skill-advisor.cjs completion zsh
```

The expected count is `9` for skill-advisor. Compact and names-only output preserve it while returning zero `inputSchema` fields. The count comes from the live `TOOL_DEFINITIONS` manifest and the parity test; this reference does not maintain a second tool inventory.

Per-command help is available and prints the command description, aliases, and input schema:

```bash
node .opencode/bin/skill-advisor.cjs advisor_status --help
```

Run the host-safe offline smoke check to verify the shim without daemon contact:

```bash
node .opencode/bin/cli-offline-smoke.cjs --format json
```

The check is the executable parity check for the live manifests, not a separate tool inventory.

---

## 9. SAFETY RULES

- Keep MCP as the primary in-session transport today; use the CLI as an additive fallback and operator surface.
- We may consider making the CLI the primary or sole transport later, but do not treat that as a decided plan.
- Prefer read-only recovery commands when transport fails: advisor recommend and advisor status.
- Prompt-time hooks must probe warm daemons only. They must not cold-spawn daemons from prompt-time paths.
- Treat exit `75` as retryable daemon/IPC unavailability. Retry after MCP reconnect, daemon prewarm, or short backoff.
- Treat exit `69` as a stale/missing dist or protocol mismatch. Rebuild the matching package before retrying.
- Skill-advisor CLI calls are untrusted by default. Mutations (`advisor_rebuild`, `skill_graph_scan`, and apply-mode `skill_graph_propagate_enhances`) require `--trusted` or `SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1`.
- Do not use `jsonl` as a streaming automation contract; it is one complete JSON payload on one line.

---

## 10. SOURCE ANCHORS

- Env flags: `runtime/ENV-REFERENCE.md` section `CLI FRONT DOOR (DUAL-STACK)`.
- Offline smoke: `.opencode/bin/cli-offline-smoke.cjs`.
