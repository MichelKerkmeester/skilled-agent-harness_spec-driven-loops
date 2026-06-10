---
title: "code-index CLI fallback surface"
description: "Daemon-backed CLI over the mk-code-index daemon: 8 commands manifest-generated from CODE_GRAPH_TOOL_SCHEMAS, blocked-read rendering preserved as actionable exit-0 answers, schema-driven argv coercion, warm-only no-spawn probing, dist-freshness guard, and the shared 0/1/64/69/75 exit taxonomy."
trigger_phrases:
  - "code-index cli"
  - "code graph cli fallback"
  - "blocked-read rendering"
  - "code_graph cli commands"
---

# code-index CLI fallback surface

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The 028 MCP-to-CLI program shipped `node .opencode/bin/code-index.cjs` as a CLI-only layer over the existing code-index daemon and launcher contracts — no daemon or launcher files changed. The CLI exposes exactly the 8 `code_graph_*` / `detect_changes` tools through a manifest generated from `CODE_GRAPH_TOOL_SCHEMAS`, validates argv with `validateToolArgs()` parity, and is the transport-down fallback when the `mcp__mk_code_index__*` MCP registration is unavailable. The repaired `mk-code-graph` OpenCode bridge routes over this CLI instead of in-process dist/DB imports.

## 2. HOW IT WORKS

### Manifest-backed command registry

`code-index-cli-manifest.ts` generates the command map from `CODE_GRAPH_TOOL_SCHEMAS`, so `code-index list-tools --format json` returns `{ status: "ok", data: { count: 8 } }` and cannot drift from the MCP registration without the parity suite failing.

### Blocked-read rendering

`status:"blocked"` readiness refusals exit 0 deliberately — blocked is an actionable answer (run the surfaced `requiredAction`), not a CLI failure. JSON output lifts `requiredAction` into both the envelope and `data`; text output renders the fixed two lines `blocked: <reason>` / `requiredAction: <action>`.

### Schema-driven argv coercion

Flag values arrive as strings, so `coerceArgsToSchema` parses number-typed fields (`"5"` becomes 5) and boolean-typed fields (`true`/`false`). Unparseable values exit 64 with a named-field message; out-of-range numbers coerce and pass through because range clamping is handler-owned, matching MCP-path behavior.

### Shim guards and exit taxonomy

`.opencode/bin/code-index.cjs` defaults the socket dir to `/tmp/mk-code-index`, refuses missing or stale dist with exit 69 (`SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE=1` is the development override), and maps spawn failure to 75. The entrypoint shares the program taxonomy: 0 success, 1 runtime, 64 usage/validation (including JSON-RPC `-32602`), 69 protocol, 75 retryable. `--warm-only` (default via `SPECKIT_CODE_INDEX_CLI_WARM_ONLY`) probes the socket and exits 75 instead of auto-spawning.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/bin/code-index.cjs` | Script | Stable shim: socket-dir defaulting, dist-freshness refusal, spawn-failure mapping |
| `mcp_server/code-index-cli.ts` | CLI entrypoint | Dispatcher, argv coercion/validation, blocked-read rendering, exit taxonomy, IPC auto-spawn |
| `mcp_server/code-index-cli-manifest.ts` | CLI manifest | Command registry generated from `CODE_GRAPH_TOOL_SCHEMAS` |
| `mcp_server/plugin_bridges/mk-code-graph-bridge.mjs` | Plugin bridge | OpenCode bridge repaired to the CLI route; maintenance tools blocked at prompt time |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/code-index-cli-parity.vitest.ts` | Automated test | Locks the 8 tools against `CODE_GRAPH_TOOL_SCHEMAS` |
| `mcp_server/tests/code-index-cli-blocked-read.vitest.ts` | Automated test | Nine stale-readiness cases asserting `status:blocked` plus `requiredAction` |
| `mcp_server/tests/code-index-cli-dual-client.vitest.ts` | Automated test | Real MCP + CLI dual-client coverage against one daemon |
| `mcp_server/tests/code-index-cli-owner-respawn.vitest.ts` | Automated test | Real owner-lease read and fresh-launcher takeover |
| `mcp_server/tests/code-index-cli-teardown.vitest.ts` | Automated test | Zero-orphan teardown after the suite |
| `mcp_server/tests/code-index-cli-harness.ts` | Test harness | Sandboxed socket/DB environment shared by the suites |

## 4. SOURCE METADATA

- Group: MCP tool surface
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `06--mcp-tool-surface/code-index-cli.md`
Related references:
- [tool-registrations.md](tool-registrations.md) — MCP registration and dispatch surface
- `.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/spec-memory-cli-daemon-backed-surface.md` — spec-memory CLI sibling surface
- Playbook counterparts: scenario 025 in `../../manual_testing_playbook/manual_testing_playbook.md` plus spec-kit playbook scenarios 427, 430, and 437
