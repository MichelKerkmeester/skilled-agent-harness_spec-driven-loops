# Review Report - gpt55r2-c-9

## Executive Summary

The one-iteration C-rest-of-server lineage found three active P1 issues and no P0 issues. The lineage verdict is CONDITIONAL because path-boundary and scoped-maintenance behavior should be remediated before this area is considered release-ready.

## Planning Trigger

This fan-out child was run for review-r2 scope `C-rest-of-server`, focused on MCP server infrastructure outside the search pipeline and store/index/lifecycle scopes. The iteration hit `config.maxIterations: 1`; convergence is not claimed.

## Active Finding Registry

| ID | Severity | Category | Finding |
| --- | --- | --- | --- |
| DR-C9-P1-001 | P1 | path-boundary | `memory_save` probes raw caller paths before allowed-root validation. |
| DR-C9-P1-002 | P1 | scope-isolation | Scoped `memory_index_scan` stale deletion is globally scoped. |
| DR-C9-P1-003 | P1 | ipc-trust-boundary | hf model-server demand listener accepts writable socket directories. |

## Remediation Workstreams

| Workstream | Findings | Recommended action |
| --- | --- | --- |
| Path-validation ordering | DR-C9-P1-001 | Move allowed-root validation ahead of existence probing and normalize outside-root errors. |
| Scoped maintenance isolation | DR-C9-P1-002 | Scope stale discovery/deletion to `specFolder`, or disable stale deletion for scoped scans. |
| Socket-dir hardening | DR-C9-P1-003 | Reject or repair non-private `SPECKIT_IPC_SOCKET_DIR` directories before bind or unlink operations. |

## Spec Seed

Add acceptance coverage that `memory_save` never performs filesystem probes on caller paths before allowed-root validation, and that `memory_index_scan({ specFolder })` cannot mutate records outside that scope.

## Plan Seed

1. Add regression tests for `memory_save` outside-root existing vs missing paths returning the same access-denied class.
2. Add regression tests for scoped scans with one stale record inside scope and one stale record outside scope.
3. Add model-server supervision tests for existing `SPECKIT_IPC_SOCKET_DIR` modes `0777`, `0775`, and `0700`.

## Traceability Status

| Check | Status |
| --- | --- |
| Findings cite source lines | Passed |
| P0 adversarial re-read | N/A, no P0 reported |
| Iteration final line contract | Passed |
| JSONL delta written | Passed |
| Resource map coverage gate | N/A, no resource-map.md present |

## Deferred Items

The full daemon/provider matrix, reconnect taxonomy, and all handler schemas were not exhausted in one iteration. Additional lineages should continue from daemon startup/restart behavior, provider fallback paths, and request schema validation edges.

## Audit Appendix

Evidence sampled:

| File | Lines |
| --- | --- |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | 3108-3125, 3185-3188 |
| `.opencode/skills/system-spec-kit/shared/utils/path-security.ts` | 18-102 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | 410-415, 537-543, 650-655, 961-967 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts` | 269-313, 323-354, 365-421 |
| `.opencode/bin/lib/model-server-supervision.cjs` | 471-501, 1219-1222, 1367-1380 |
| `.opencode/bin/spec-memory.cjs` | 103-109 |

Final verdict: CONDITIONAL
