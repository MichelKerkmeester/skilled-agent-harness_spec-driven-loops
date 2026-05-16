# iter-004 — TESTING

**Dimension**: Testing — Coverage gaps in vitest; missing rename-invariant assertions; integration test reach
**Date**: 2026-05-15
**Files Reviewed**: 41 vitest test files (advisor package), rename-invariants.vitest.ts, vitest.config.ts

## Findings

| ID | Severity | Title | Location | Category |
|----|----------|-------|----------|----------|
| T-001 | P2 | No automated vitest for advisor-server.ts `dispatchTool` routing across all 8 tools | `tests/handlers/skill-graph-dispatch.vitest.ts` covers skill_graph_* only | testing/dispatch-coverage |
| T-002 | P2 | No vitest for launcher `acquireBootstrapLock` timeout/recovery behavior | `mk-skill-advisor-launcher.cjs:140-160` | testing/launcher-coverage |
| T-003 | P2 | No vitest for `buildIfNeeded` artifact staleness detection | `mk-skill-advisor-launcher.cjs:119-137` | testing/build-verification |
| T-004 | P2 | Plugin bridge vitest tests exist but depend on subprocess spawning (not isolated unit tests) | `tests/compat/plugin-bridge.vitest.ts`, `tests/compat/plugin-bridge-smoke.vitest.ts` | testing/integration-surface |
| T-005 | P1 | No cross-runtime config parity vitest that verifies ALL 4 runtime configs have identical server entries | `tests/rename-invariants.vitest.ts:37-60` tests alignment but only for mk_skill_advisor key existence — not full config parity | testing/config-parity |

## Analysis

### Test coverage: GOOD

The advisor test suite is extensive:
- **41 vitest files** with **378+ test cases** (378 `it`/`describe`/`test` calls)
- Categories: handlers (advisor_* + skill_graph_*), compat (plugin bridge, shim, python), scorer (fusion, lanes, weights), daemon (watcher, freshness, lease), legacy (corpus parity, graph health), schemas, cache, shadow-sink

### Rename invariants: COVERED

`rename-invariants.vitest.ts` (added in 016 as targeted P2 remediation) covers:
- Server registration identity (`mk_skill_advisor`)
- Launcher binary + state identity
- All 4 runtime configs (OpenCode, Claude, Codex, Gemini)
- Negative assertions (old names must NOT appear)

### Coverage gaps: MINOR

T-001: `advisor-server.ts:dispatchTool` routes 8 tools. The vitest at `skill-graph-dispatch.vitest.ts` covers skill_graph_* dispatch but there's no equivalent for advisor_* dispatch at the server level. Individual handler tests exist (`advisor-recommend.vitest.ts`, `advisor-status.vitest.ts`, etc.) but there's no single integration test verifying the server's tool routing table is complete.

T-005: The rename-invariants test checks config alignment but only for the `mk_skill_advisor` key's existence and launcher path. It doesn't verify that all 4 configs expose identical tool sets, env var settings, or any other parity dimension.

### Integration test reach: ADEQUATE

The compat/ tests cover plugin bridge, Python shim, and daemon probe integration. The `plugin-bridge-smoke.vitest.ts` tests subprocess invocation of the bridge, which exercises real MCP message passing. The legacy tests cover corpus parity (197 prompts) and Python/TS parity (027/003 regression protection).

## Verdict: PASS with 1 P1, 4 P2 advisories
