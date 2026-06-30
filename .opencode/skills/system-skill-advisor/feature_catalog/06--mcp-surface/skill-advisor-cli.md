---
title: "Daemon-backed skill-advisor CLI"
description: "CLI fallback over the advisor daemon: 9 commands with byte-identical schemas to TOOL_DEFINITIONS, a fail-closed trusted-mutation gate (--trusted / MK_SKILL_ADVISOR_CLI_TRUSTED, daemon-side MK_SKILL_ADVISOR_TRUST_DEFAULT), warm-only no-spawn probing, dist-freshness guard, and the shared 0/1/64/69/75 exit taxonomy."
trigger_phrases:
  - "skill-advisor cli"
  - "advisor cli fallback"
  - "trusted mutation gate"
  - "MK_SKILL_ADVISOR_CLI_TRUSTED"
version: 0.8.0.2
---

# Daemon-backed skill-advisor CLI

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The 028 MCP-to-CLI program shipped `node .opencode/bin/skill-advisor.cjs` as a CLI-only layer over the existing advisor daemon contract. The CLI exposes 9 commands through a hand-maintained manifest whose schemas are held byte-identical to the server `TOOL_DEFINITIONS` by a dedicated parity suite (`tests/skill-advisor-cli-manifest-parity.vitest.ts`) — drift between the two registries fails tests rather than shipping. `skill-advisor list-tools --format json` returns `{ status: "ok", data: { count: 9 } }` as the runtime parity check. The Python facade `skill_advisor.py` stayed untouched. The OpenCode bridge gained CLI fallback routing with its primary path intact, and the Claude/OpenCode prompt-submit hooks gained the warm-only CLI fallback.

## 2. HOW IT WORKS

### Fail-closed trusted-mutation gate

Calls are sent untrusted by default. The mutation set — `advisor_rebuild`, `skill_graph_scan`, and `skill_graph_propagate_enhances` in real apply mode (`mode=apply` with `dryRun` not true; the schema defaults `dryRun` to true, keeping default apply-mode calls read-safe) — requires `--trusted` (alias `--maintainer`) or `MK_SKILL_ADVISOR_CLI_TRUSTED=1`. Untrusted attempts are refused client-side with exit 64 before any IPC frame. The daemon enforces the gate independently via `_meta.callerAuthority`, defaulting untrusted unless `MK_SKILL_ADVISOR_TRUST_DEFAULT=trusted` is set in the daemon's own environment.

### Shim guards and exit taxonomy

`.opencode/bin/skill-advisor.cjs` defaults the socket dir to `/tmp/mk-skill-advisor`, walks the TypeScript source tree for mtimes and refuses stale dist with exit 69 (`MK_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE=1` or `SPECKIT_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE=1` override in development), and maps spawn failure to 75. The entrypoint shares the program taxonomy: 0 success, 1 runtime, 64 usage/validation/trust refusal, 69 protocol, 75 retryable. `--warm-only` (default via `MK_SKILL_ADVISOR_CLI_WARM_ONLY` / `SPECKIT_SKILL_ADVISOR_CLI_WARM_ONLY`) probes the socket and exits 75 instead of auto-spawning.

### Scan job semantics

`skill_graph_scan` runs as a job: the CLI captures `advisor_status` before and after the scan so the operator sees the generation move, with rebuild/scan wall-time locked by the job-semantics suite.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/bin/skill-advisor.cjs` | Script | Stable shim: socket-dir defaulting, recursive source-mtime dist guard, spawn-failure mapping |
| `mcp_server/skill-advisor-cli.ts` | CLI entrypoint | Dispatcher, trusted-mutation gate, caller-authority tagging, warm-only probe, exit taxonomy |
| `mcp_server/skill-advisor-cli-manifest.ts` | CLI manifest | Hand-maintained command registry, held byte-identical to `TOOL_DEFINITIONS` by the manifest parity suite |
| `mcp_server/advisor-server.ts` | Daemon | Daemon-side trust default (`MK_SKILL_ADVISOR_TRUST_DEFAULT`) |
| `mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs` | Plugin bridge | CLI fallback route with primary path untouched |
| `hooks/lib/skill-advisor-cli-fallback.ts` | Hook helper | Shared warm-only CLI fallback for Claude/OpenCode prompt-submit hooks |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/skill-advisor-cli-parity.vitest.ts` | Automated test | 10-prompt local-vs-native parity fixture (runs real python3) |
| `mcp_server/tests/skill-advisor-cli-dual-client.vitest.ts` | Automated test | Dual-client MCP + CLI coverage against one daemon |
| `mcp_server/tests/skill-advisor-cli-job-semantics.vitest.ts` | Automated test | Rebuild/scan job semantics with measured wall-time under mutation |
| `mcp_server/tests/skill-advisor-launcher-orphan-reaping.vitest.ts` | Automated test | Real-launcher orphan reaping (killed parent, removed worktree, warm adoption) |
| `mcp_server/tests/tri-daemon-drill.vitest.ts` | Automated test | Env-gated tri-daemon spawn drill (028 program gate, `SPECKIT_RUN_TRI_DAEMON_DRILL=1`) |
| `mcp_server/tests/handlers/advisor-trust-gate.vitest.ts` | Automated test | Daemon-side trust-gate enforcement including the env grant |

## 4. SOURCE METADATA

- Group: MCP surface
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `06--mcp-surface/skill-advisor-cli.md`
Related references:
- [compat-entrypoint.md](compat-entrypoint.md) — Stable compat entrypoint
- `../08--python-compat/cli-shim.md` — Python facade (`skill_advisor.py`), untouched by 028
- Playbook counterparts: scenario CL-006 in `../../manual_testing_playbook/manual_testing_playbook.md` plus spec-kit playbook scenarios 427, 431, 432, and 438
