# Iteration 004: TESTING

**Dimension**: Testing — vitest coverage for the rename, smoke matrix, typecheck coverage, manual testing readiness

**Date**: 2026-05-14

**Executor**: opencode-go/deepseek-v4-pro

---

## Investigation Summary

Audited the test suite for the advisor package and spec-kit MCP for coverage of the rename. Checked existing vitest tests, smoke procedures, and typecheck verification.

### Test Coverage Assessment

| Test File | mk_skill_advisor Coverage | Status |
|-----------|--------------------------|--------|
| `handlers/skill-graph-listing.vitest.ts` | `describe('mk_skill_advisor skill_graph_* listing', ...)` — explicitly tests the mk-prefixed server name | Covered |
| `handlers/skill-graph-dispatch.vitest.ts` | Tests `dispatchTool()` from `advisor-server.js` — exercises server dispatch | Covered (via `dispatchTool`) |
| `handlers/advisor-recommend.vitest.ts` | Tests `advisor_recommend` handler — tool id stability | Covered |
| `handlers/advisor-status.vitest.ts` | Tests `advisor_status` handler — uses `system-skill-advisor` folder path (correct) | Covered |
| `handlers/advisor-validate.vitest.ts` | Tests `advisor_validate` handler — tool id stability | Covered |
| `schemas/advisor-tool-schemas.vitest.ts` | Schema validation — tool schemas unchanged by rename | Covered |
| `legacy/advisor-*.vitest.ts` | Legacy advisor tests — use folder paths (`system-skill-advisor`) not server id | Covered (folder name unchanged) |
| `compat/plugin-bridge.vitest.ts` | Bridge subprocess test — references `mk-skill-advisor-launcher.cjs` | Covered |
| `compat/shim.vitest.ts` | Python shim test — references `system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Covered (folder path) |

### Missing Test Coverage

| Gap | Severity | Description |
|-----|----------|-------------|
| Server registration test | P2 | No vitest test verifies that `advisor-server.ts` registers as `mk_skill_advisor` specifically (the `Server` constructor call at line 237 is exercised transitively but never asserted directly) |
| Launcher state file identity test | P2 | No vitest test verifies the launcher writes `.mk-skill-advisor-launcher.json` with the correct `command` field |
| Runtime config consistency check | P2 | No automated test verifies all four runtime configs (`opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.gemini/settings.json`) agree on `mk_skill_advisor` |

### Verification Methods Used (per plan.md §5)

| Method | Tool | Result |
|--------|------|--------|
| Advisor typecheck | `npm run typecheck` | PASS (recorded) |
| Spec-kit MCP typecheck | `npx tsc --noEmit` | PASS (recorded) |
| Launcher smoke | `timeout 8 node .opencode/bin/mk-skill-advisor-launcher.cjs` | PASS (recorded) |
| MCP list | `opencode mcp list` | PASS (recorded) |
| Old namespace grep | `rg` exclusions | PASS (verified in iter-002) |
| Strict spec validation | `validate.sh` | PASS (recorded) |

### Vitest Suite Scope

The advisor test suite has extensive coverage (~40+ vitest files) covering:
- Handler dispatch (advisor_recommend, advisor_status, advisor_validate, skill_graph_*)
- Schema validation (workspaceRoot bounding, corpus/regression row schemas)
- Scorer lanes (semantic, graph-causal, derived, fusion, ablation, quality)
- Daemon lifecycle (freshness, watcher, lease)
- Prompt cache, privacy, observability, timing
- Python/TS parity
- Plugin bridge smoke and contract
- Skill graph DB indexing

However, no existing test explicitly verifies the **rename itself** — i.e., asserts that `mk_skill_advisor` is the server name and `mk-skill-advisor-launcher` is the launcher identity. The rename is verified through the manual smoke matrix rather than automated vitest assertions.

---

## Findings

| ID | Severity | Title | Location | Category |
|----|----------|-------|----------|----------|
| F-006 | P2 | No automated vitest assertion for mk_skill_advisor server registration identity | `advisor-server.ts:237` | testing |
| F-007 | P2 | No automated vitest assertion for launcher state file command identity | `mk-skill-advisor-launcher.cjs:207` | testing |
| F-008 | P2 | No automated cross-config consistency check for mk_skill_advisor across four runtime configs | `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.gemini/settings.json` | testing |

### F-006: No automated assertion for server registration name

**Rationale**: The `advisor-server.ts:237` line `{ name: 'mk_skill_advisor', version: '0.1.0' }` is exercised only transitively through handler dispatch tests. A regression that changes this name back to `system_skill_advisor` would not be caught by any existing vitest test. The `skill-graph-listing.vitest.ts` tests the tool listing but not the server identity.

**Suggested Remediation**: Add a vitest assertion in `handlers/skill-graph-listing.vitest.ts` or a new test that verifies the `Server` constructor receives `{ name: 'mk_skill_advisor' }`.

### F-007: No automated assertion for launcher state file identity

**Rationale**: The launcher writes a state file with `command: 'mk-skill-advisor-launcher'` at line 207. No vitest test verifies that the launcher's state file contains the mk-prefixed command name rather than the old `skill-advisor-launcher`. A regression would go undetected.

**Suggested Remediation**: Add a vitest test that exercises the launcher's `writeState` function or validates the JSON schema of the state file.

### F-008: No automated cross-config consistency check

**Rationale**: All four runtime configs must agree on `mk_skill_advisor` as the server id. Currently this is verified only via manual grep. A regression where one config is updated while another is not would not be caught automatically.

**Suggested Remediation**: Add a vitest test that reads all four config files and asserts they all specify `mk_skill_advisor` as the MCP server key.

---

## Convergence Delta

New findings vs prior iterations: **3** (F-006, F-007, F-008). Cumulative so far: F-001 through F-008 (all P2). Still zero P0 or P1 findings.

## Dimension Coverage

| Dimension | Status |
|-----------|--------|
| ARCHITECTURE | Covered (iter-001) |
| CORRECTNESS | Covered (iter-002) |
| ROBUSTNESS | Covered (iter-003) |
| TESTING | Covered (this iteration) |
| DOCUMENTATION | Pending |
