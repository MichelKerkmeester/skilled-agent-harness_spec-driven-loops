---
title: "Daemon-backed spec-memory CLI surface"
description: "Dual-stack CLI over the unchanged mk-spec-memory daemon: all 41 tools generated from TOOL_DEFINITIONS, a stable shim with dist-freshness and socket-path guards, the shared 0/1/64/69/75 exit taxonomy, warm-only no-spawn probing, and IPC auto-spawn through the launcher."
trigger_phrases:
  - "spec-memory cli"
  - "daemon-backed cli surface"
  - "cli exit taxonomy"
  - "warm-only cli probe"
  - "dist freshness guard"
version: 3.6.0.3
---

# Daemon-backed spec-memory CLI surface

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The 028 MCP-to-CLI program shipped `node .opencode/bin/spec-memory.cjs` as a second IPC client over the unchanged mk-spec-memory daemon. The CLI generates its command map at runtime from `TOOL_DEFINITIONS`, so all 41 MCP tools are CLI commands with no generated manifest to drift. It validates argv-derived arguments with the existing Zod schemas, sends `tools/call` JSON-RPC frames over `daemon-ipc.sock`, auto-spawns via `mk-spec-memory-launcher.cjs` when the daemon probe fails, and renders `json`, `jsonl`, or text output.

The MCP registration stays untouched through the dual-stack window. The CLI is the resilience and universal surface for hooks, cron, CI, and transport-down recovery. Sibling skills ship the same pattern: `code-index.cjs` (8 tools, system-code-graph) and `skill-advisor.cjs` (9 tools plus a trusted-mutation gate, system-skill-advisor).

## 2. HOW IT WORKS

### Shim guards before dispatch

`.opencode/bin/spec-memory.cjs` defaults unset `SPECKIT_IPC_SOCKET_DIR` to `/tmp/mk-spec-memory`, rejects socket paths over the Darwin `sun_path` limit, and refuses missing or stale `dist/spec-memory-cli.js` with exit 69 (a source file newer than dist trips the guard; `SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1` is the development override). A shim-level spawn failure exits 75.

### Exit taxonomy shared by all three CLIs

`EXIT_SUCCESS=0`, `EXIT_RUNTIME=1`, `EXIT_USAGE=64` (CLI usage errors, schema-validation failures, and JSON-RPC `-32602`), `EXIT_PROTOCOL=69` (protocol mismatch and the shim's dist-freshness refusal), `EXIT_RETRYABLE=75` (backend unavailable, connection or call timeout).

### Warm-only no-spawn probing

`--warm-only` (default-on via `SPECKIT_SPEC_MEMORY_CLI_WARM_ONLY`; `--no-warm-only` reverts) probes the socket first and exits 75 with `backend unavailable` instead of cold-spawning the launcher. This is the contract prompt-time hooks rely on: a transport-down probe costs about a millisecond and never boots a daemon from the prompt path.

### list-tools as the parity anchor

`spec-memory list-tools --format json` enumerates the generated surface as `{ status: "ok", data: { count: 41, tools: [...] } }` straight from `TOOL_DEFINITIONS`, so surface parity against the MCP registration is a one-command check.

The automation surface also supports `list-tools --compact` and `list-tools --names-only` across the three daemon CLIs. Compact mode keeps names, aliases, descriptions, and counts while omitting schemas; names-only mode keeps canonical tool names and counts only. Both modes preserve the 41 / 8 / 9 counts and return zero `inputSchema` fields. `completion bash|zsh` emits generated shell completion from the same registries for `spec-memory`, `code-index`, and `skill-advisor`.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/bin/spec-memory.cjs` | Script | Stable shim: socket-dir defaulting, Darwin socket-path guard, dist-freshness refusal (exit 69), spawn-failure mapping (exit 75) |
| `mcp_server/spec-memory-cli.ts` | CLI entrypoint | Runtime command generation from `TOOL_DEFINITIONS`, Zod argv validation, IPC `tools/call` path, warm-only probe, exit taxonomy, output rendering |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Script | Auto-spawn target when the daemon probe fails outside warm-only mode |
| `.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts` | Sibling CLI entrypoint | Compact/names-only list-tools and generated completion for the code-index CLI |
| `.opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts` | Sibling CLI entrypoint | Compact/names-only list-tools and generated completion for the skill-advisor CLI |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/spec-memory-cli.vitest.ts` | Automated test | Parser, IPC, retryable, and protocol-drift coverage |
| `mcp_server/tests/spec-memory-cli-parity-and-help.vitest.ts` | Automated test | Locks 41-tool parity and CLI help behavior |
| `mcp_server/tests/spec-memory-cli-help-aliases-errors.vitest.ts` | Automated test | Compact/names-only list-tools and generated completion coverage for spec-memory |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-help-aliases-errors.vitest.ts` | Automated test | Compact/names-only list-tools and generated completion coverage for code-index |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-cli-help-aliases-errors.vitest.ts` | Automated test | Compact/names-only list-tools and generated completion coverage for skill-advisor |
| `mcp_server/tests/spec-memory-cli-dual-spawn-hardening.vitest.ts` | Automated test | Dual-spawn hardening with re-election on and off |
| `mcp_server/tests/spec-memory-cli-dual-client-hardening.vitest.ts` | Automated test | Real MCP and CLI clients running concurrently against one daemon |
| `mcp_server/tests/spec-memory-cli-lifecycle-hardening.vitest.ts` | Automated test | N-probe reap gating and SIGTERM transparent-recycle behavior |

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `tooling_and_scripts/spec_memory_cli_daemon_backed_surface.md`
Related references:
- [cli-runtime-warm-only-fallbacks.md](cli_runtime_warm_only_fallbacks.md) — Warm-only CLI hook fallbacks and plugin bridges
- [standalone-admin-cli.md](standalone_admin_cli.md) — Direct-DB maintenance CLI (`spec-kit-cli`), unchanged by 028
- `.opencode/skills/system-code-graph/feature_catalog/mcp_tool_surface/code_index_cli.md` — code-index CLI sibling surface
- `.opencode/skills/system-skill-advisor/feature_catalog/mcp_surface/skill_advisor_cli.md` — skill-advisor CLI sibling surface
