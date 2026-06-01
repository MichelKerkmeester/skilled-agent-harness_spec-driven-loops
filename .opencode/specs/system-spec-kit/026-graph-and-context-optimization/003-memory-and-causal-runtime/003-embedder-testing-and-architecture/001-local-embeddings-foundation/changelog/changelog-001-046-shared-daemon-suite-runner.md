---
title: "046 Shared Daemon Suite Runner"
description: "A direct MCP client runner replaced the per-scenario child-agent approach from packet 043. The runner holds one shared Spec Kit Memory client and one shared CocoIndex client, routes calls by server name. It fails closed for unknown surfaces. Smoke scenarios 403, 404, 407, 410 all passed."
trigger_phrases:
  - "shared daemon suite runner"
  - "run-mcp-direct runner"
  - "cocoindex mcp wiring 046"
  - "single daemon scenario runner"
  - "045 shared daemon implementation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/046-shared-daemon-suite-runner` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

Packet 043 proved that spawning one child agent per scenario was the wrong architecture for the local LLM query-intelligence suite. Each child started its own MCP daemon stack, which could contend with the main session's local llama-cpp Metal context before any scenario logic ran.

A direct Node MCP client runner replaced that approach. The runner creates one `StdioClientTransport` for `spec_kit_memory` and a second for `cocoindex_code`, routes every parsed tool call to the correct client by server name and writes TSV evidence without child agents or nested `codex exec`. A pure `selectClientForServer()` helper with unit coverage handles memory routing, CocoIndex routing and unknown-server fallback. Scenario 410 gained full automation with a generated 50-query workload capturing cold and steady latency metrics. Smoke scenarios 403, 404, 407, 410 all exited with PASS verdicts through the shared-daemon path.

### Added

- Second `StdioClientTransport` for the CocoIndex MCP daemon so `cocoindex_code` scenarios run through a dedicated shared client.
- Per-server tool discovery sets so unavailable-tool checks inspect the correct MCP surface.
- Routing map that dispatches `spec_kit_memory` calls to the memory client and `cocoindex_code` calls to the CocoIndex client.
- Pure `selectClientForServer()` helper with unit coverage for memory routing, CocoIndex routing and unknown-server fallback.
- Scenario 410 automation with a generated 50-query workload. Cold and steady runs report p50/p95/p99/qps separately.
- Capped daemon stderr evidence logs (200KB limit per daemon) for startup diagnosis.
- `shared-daemon-runner-helpers.vitest.ts` unit test covering playbook tool-call parser and routing helper.

### Changed

- Suite runner architecture moved from one child agent per scenario to two long-lived shared MCP daemon connections.
- Daemon readiness handling made bounded so CocoIndex startup indexing does not cause the first search call to fail.

### Fixed

- Scenarios 403, 404, 407 previously returned SKIP because the cocoindex_code surface had no connected client. Routing through the second shared CocoIndex transport resolved this.

### Verification

| Check | Result |
|-------|--------|
| SDK version discovery | PASS: `@modelcontextprotocol/sdk` version `1.26.0`. |
| Launcher discovery | PASS: launcher starts `dist/context-server.js` with `stdio: inherit`. |
| Tool discovery | PASS: memory daemon lists memory tools. CocoIndex daemon lists `search` and `cocoindex_refresh_index`. |
| Runner syntax | PASS: `node --check` on `run-mcp-direct.mjs` exited 0. |
| Parser and routing unit test | PASS: `npx vitest run tests/shared-daemon-runner-helpers.vitest.ts` exited 0 with 1 file and 2 tests passing. |
| Smoke 403/404/407/410 | PASS: command exited 0. 403 PASS. 404 PASS. 407 PASS. 410 PASS. |
| Smoke TSV | PASS: `run-2026-05-14-shared-daemon.summary.tsv` written with one row per scenario. |
| Strict validate | PASS: `validate.sh` exited 0 with 0 errors and 0 warnings. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/tests/shared-daemon-runner-helpers.vitest.ts` | Updated | Unit coverage for tool-call parser and `selectClientForServer()` routing helper. |
| `_sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs` | Updated | Direct MCP suite runner with shared memory and CocoIndex clients. Per-server routing. 410 automation. Capped stderr evidence. |
| `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-shared-daemon.summary.tsv` | Generated | Smoke summary TSV with PASS rows for scenarios 403, 404, 407, 410. |

### Follow-Ups

- Extend the runner to cover the full scenarios 401 to 415 once the operator confirms the shared-daemon architecture is stable.
- Sync the substrate stress harness at `mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs` with the TSV output format until an automated mirror lands.
- Consider disabling daemon stderr capture by default and requiring an explicit flag for operators who need startup diagnostics.
