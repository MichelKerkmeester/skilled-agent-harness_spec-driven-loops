---
title: Daemon CLI Reference
description: Canonical reference for the three daemon-backed CLI shims over mk-spec-memory, mk-code-index, and mk-skill-advisor.
---

# Daemon CLI Reference

The daemon CLI shims are additive IPC clients over the existing MCP daemons. They are not replacement servers, and MCP remains the primary in-session transport.

Use these CLIs when a runtime MCP transport is missing, failed, or not reconnecting while the daemon is expected to be warm, or when an operator needs shell diagnostics, CI checks, or scripted maintenance.

## 1. CLI Surfaces

| CLI shim | MCP daemon | Tool count | Primary use |
| --- | --- | ---: | --- |
| `node .opencode/bin/spec-memory.cjs` | `mk-spec-memory` | 37 | Memory context, search, health, indexing, checkpoint, and session recovery fallback. |
| `node .opencode/bin/code-index.cjs` | `mk-code-index` | 8 | Code graph status, scan, verify, query, context, apply-mode recovery, and diff impact fallback. |
| `node .opencode/bin/skill-advisor.cjs` | `mk_skill_advisor` | 9 | Advisor recommendations, advisor health, skill graph diagnostics, and trusted maintainer mutations. |

Each shim first checks its built CLI entrypoint, sets a default socket directory when needed, then runs the compiled CLI with inherited stdio. `list-tools` and `--help` are served from local definitions and do not contact or spawn a daemon.

## 2. Invocation Forms

Common form:

```bash
node .opencode/bin/<cli>.cjs list-tools [--format json|text|jsonl]
node .opencode/bin/<cli>.cjs <tool_name> [--json '{...}'] [--format json|text|jsonl] [--timeout-ms N] [--warm-only]
node .opencode/bin/<cli>.cjs <tool_name> --param value [--another-param value]
node .opencode/bin/<cli>.cjs <tool_name> --help
```

Tool names accept the aliases exposed by the CLI. The memory and code-index CLIs expose snake_case, kebab-case, and camelCase aliases from the tool name; the advisor CLI exposes aliases from its manifest.

Use `--json` for one complete JSON object argument when a tool has structured input:

```bash
node .opencode/bin/spec-memory.cjs memory_context --json '{"input":"resume previous work","mode":"resume"}' --format json --timeout-ms 3000
node .opencode/bin/code-index.cjs code_graph_status --format json --timeout-ms 3000 --warm-only
node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"implement cli core"}' --format json --timeout-ms 3000 --warm-only
```

## 3. Output Formats

All three CLIs accept `--format json|text|jsonl`.

| Format | Behavior |
| --- | --- |
| `json` | Pretty-printed JSON payload. |
| `text` | Human-readable summary when the payload has one; `list-tools --format text` prints tool names. |
| `jsonl` | A single complete JSON payload rendered on one stdout line. |

`jsonl` is not streaming JSON Lines. Do not assume one record per tool, one record per result, or incremental output. When passing input with `--json`, pass one complete JSON object as one shell argument; the CLIs do not parse a stream of JSONL records from stdin.

## 4. Exit-Code Taxonomy

| Exit | Meaning | Notes |
| ---: | --- | --- |
| `0` | Success | Includes actionable code-index `status:"blocked"` readiness refusals; blocked reads are valid answers with `requiredAction`. |
| `1` | Runtime error | Tool returned an error payload or an unclassified runtime failure occurred. |
| `64` | Usage or schema error | Bad flags, invalid `--json`, schema validation failure, advisor trusted-mutation refusal, or code-index `detect_changes` `parse_error`. |
| `69` | Protocol mismatch or stale/missing dist | The shim or CLI refused an unsafe build/protocol state. Rebuild the matching package before retrying. |
| `75` | Retryable daemon/IPC error | Warm-only daemon unavailable, connection refused/reset, timeout, busy database, spawn failure, or retryable backend state. |

Exit `75` is retryable. Treat it as daemon or IPC unavailability, not as user input failure.

## 5. Warm-Only Policy

Prompt-time hooks and prompt-time runtime fallbacks must use warm-only behavior. Warm-only probes the daemon socket and exits `75` when the daemon is cold instead of cold-spawning it.

Use either the explicit flag or the prompt-time env flags:

```bash
node .opencode/bin/spec-memory.cjs memory_stats --warm-only --format json --timeout-ms 3000
node .opencode/bin/code-index.cjs code_graph_status --warm-only --format json --timeout-ms 3000
node .opencode/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --warm-only --format json --timeout-ms 3000
```

Warm-only defaults can also come from env flags documented in `../config/environment_variables.md` and `../../mcp_server/ENV_REFERENCE.md`: per-CLI `*_CLI_WARM_ONLY`, per-CLI `*_CLI_PROMPT_TIME`, cross-CLI `SPECKIT_CLI_PROMPT_TIME`, and runtime prompt-time markers such as `OPENCODE_PROMPT_TIME`, `CODEX_PROMPT_TIME`, and `CLAUDE_CODE_PROMPT_TIME`.

Non-prompt contexts such as explicit operator maintenance, CI, cron, or session startup may omit `--warm-only`; then a cold daemon can auto-spawn through the matching `mk-*-launcher.cjs`.

## 6. Exit 69 Recovery

The shims refuse stale or missing dist entrypoints with exit `69`. Rebuild before retrying.

| CLI | Shim stale/missing message | Build recovery |
| --- | --- | --- |
| `spec-memory.cjs` | `Run npm run build --workspace=@spec-kit/mcp-server.` | `npm run build --workspace=@spec-kit/mcp-server` |
| `code-index.cjs` | `Run tsc -p .opencode/skills/system-code-graph/tsconfig.json.` | `npm --prefix .opencode/skills/system-code-graph run build` or the exact `tsc -p ...` command from the shim. |
| `skill-advisor.cjs` | `Run the skill-advisor TypeScript build.` | `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build` |

Development-only stale overrides exist for local loops, but should not be used in normal recovery: `SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1`, `SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE=1`, and `MK_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE=1` or `SPECKIT_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE=1`.

## 7. Help And Discovery

Use `list-tools` for offline surface discovery:

```bash
node .opencode/bin/spec-memory.cjs list-tools --format json
node .opencode/bin/code-index.cjs list-tools --format json
node .opencode/bin/skill-advisor.cjs list-tools --format json
```

Expected counts are `37`, `8`, and `9` respectively.

Per-command help is available and prints the command description, aliases, and input schema:

```bash
node .opencode/bin/spec-memory.cjs memory_stats --help
node .opencode/bin/code-index.cjs code_graph_status --help
node .opencode/bin/skill-advisor.cjs advisor_status --help
```

Run the host-safe offline smoke check to verify all three shims without daemon contact:

```bash
node .opencode/bin/cli-offline-smoke.cjs --format json
```

The smoke check expects `spec-memory=37`, `code-index=8`, `skill-advisor=9`, and `daemonFree:true` for each result.

## 8. Safety Rules

- Keep MCP as the primary in-session transport; use CLIs as additive fallbacks and operator surfaces.
- Prefer read-only recovery commands when transport fails: memory context/status, code graph status/query reads, advisor recommend/status.
- Prompt-time hooks must probe warm daemons only. They must not cold-spawn daemons from prompt-time paths.
- Treat exit `75` as retryable daemon/IPC unavailability. Retry after MCP reconnect, daemon prewarm, or short backoff.
- Treat exit `69` as a stale/missing dist or protocol mismatch. Rebuild the matching package before retrying.
- Keep code-index maintenance commands such as `code_graph_scan`, `code_graph_apply`, and `code_graph_verify` out of prompt-time hooks.
- Skill-advisor CLI calls are untrusted by default. Mutations (`advisor_rebuild`, `skill_graph_scan`, and apply-mode `skill_graph_propagate_enhances`) require `--trusted` or `MK_SKILL_ADVISOR_CLI_TRUSTED=1`.
- Do not use `jsonl` as a streaming automation contract; it is one complete JSON payload on one line.

## 9. Source Anchors

- CLI sources: `system-spec-kit/mcp_server/spec-memory-cli.ts`, `system-code-graph/mcp_server/code-index-cli.ts`, `system-skill-advisor/mcp_server/skill-advisor-cli.ts`.
- Shim sources: `.opencode/bin/spec-memory.cjs`, `.opencode/bin/code-index.cjs`, `.opencode/bin/skill-advisor.cjs`.
- Env flags: `mcp_server/ENV_REFERENCE.md` section `CLI FRONT DOOR (DUAL-STACK)`.
- Offline smoke: `.opencode/bin/cli-offline-smoke.cjs`.
