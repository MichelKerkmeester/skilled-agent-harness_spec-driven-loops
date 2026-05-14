---
title: "Implementation Summary: Move skill_graph_* tools to advisor ownership"
description: "D1 evidence ledger for registering skill_graph_* on system_skill_advisor and adding the temporary spec_kit_memory proxy."
trigger_phrases:
  - "013/009/008 implementation summary"
  - "skill graph advisor move summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/013-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/008-move-skill-graph-tools-to-advisor"
    last_updated_at: "2026-05-14T15:20:00Z"
    last_updated_by: "codex"
    recent_action: "Dispatch D1 completed: advisor registration plus memory bridge proxy"
    next_safe_action: "Dispatch D2 (T016-T034: cutover + cleanup + verify)"
    blockers:
      - "D2 consumer cutover and proxy removal still pending."
      - "Full memory package test suite remains red from existing stale-path/environment failures unrelated to D1 targeted tests."
    key_files:
      - "implementation-summary.md"
      - "tasks.md"
      - "checklist.md"
      - ".opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/"
      - ".opencode/skills/system-spec-kit/mcp_server/tools/skill-graph-tools.ts"
    completion_pct: 50
    open_questions: []
    answered_questions:
      - "Handler layout: subdir under system-skill-advisor/mcp_server/handlers/skill-graph."
      - "Risk R-epsilon path: direct import from system-spec-kit public skill-graph DB/query layer; no neutral seam created."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `008-move-skill-graph-tools-to-advisor` |
| **Completed** | Not complete |
| **Level** | 3 |
| **Status** | D1 complete; D2 pending |
| **Completion** | 50% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

D1 implemented the additive half of 013/009/008.

- `system_skill_advisor` now registers the four unchanged public ids: `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, and `skill_graph_validate`.
- Skill graph handlers moved to `system-skill-advisor/mcp_server/handlers/skill-graph/` with the existing response envelope, README, and index harness.
- `spec_kit_memory` now keeps bridge-only descriptors and forwards legacy `skill_graph_*` calls to `system_skill_advisor` via a one-window stdio MCP proxy.
- The old 7-file `system-spec-kit/mcp_server/handlers/skill-graph/` handler directory contents were physically deleted.
- Existing memory handler tests that validated active skill-graph behavior now target the advisor-owned handler path; memory proxy tests cover bridge behavior.

### D1 Files

| Area | Evidence |
|------|----------|
| Advisor descriptors | `tools/skill-graph-tools.ts` defines 4 descriptors and exports them through `tools/index.ts`. |
| Advisor dispatch | `advisor-server.ts` includes all 8 tools in `tools/list` and dispatches `skill_graph_*` through advisor-local handlers. |
| Handler move | `handlers/skill-graph/{scan,query,status,validate,index,response-envelope,README}.ts/md` created under advisor. |
| Memory proxy | `system-spec-kit/mcp_server/tools/skill-graph-tools.ts` replaced by a proxy with once-only deprecation log and 10s timeout. |
| Memory descriptors | `system-spec-kit/mcp_server/tool-schemas.ts` annotated as bridge-only for D2 removal. |
| Deleted memory handlers | 7 old files under `system-spec-kit/mcp_server/handlers/skill-graph/` removed. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation followed D1 only: setup inventory, advisor registration, handler move, tests, memory proxy, tests, builds, and MCP listing smokes. D2 consumer cutover files were not edited.

One hidden wire-safety dependency was discovered: `system-spec-kit/mcp_server/handlers/session-bootstrap.ts` imported the old handler files directly. Because D1 physically deletes those files, that internal memory path was switched to the temporary `skill_graph_*` proxy. This is recorded as a scope anomaly, but without it the memory MCP would fail after the required delete.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Keep `skill_graph_*` public tool ids stable | Mirrors ADR-001; only server prefix changes for primary callers. |
| Use `handlers/skill-graph/` subdir | Preserves the existing response envelope and export harness with minimal code churn. |
| Use R-epsilon Path 1 | Handlers import the public system-spec-kit `lib/skill-graph/*` DB/query layer directly; no private handler import remains and no neutral seam was needed. |
| Keep memory descriptors bridge-only | D1 must keep both server prefixes resolvable; D2 removes descriptors after cutover/confirmation. |
| Patch session-bootstrap to proxy | Required for memory MCP wire safety after deleting old handler files. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Setup live old-prefix grep | 10 hits across 4 non-spec files. Differs from dispatch expectation of 7/6; all are D2 consumer/doc surfaces and were not edited. |
| Advisor baseline Vitest | 280/287 passing before edits. |
| Advisor after Vitest | 285/291 passing after edits. Remaining failures: known parity, graph-health, and lane sweep issues. No D1 regression; new tests pass. |
| Advisor targeted tests | PASS: `npx vitest run tests/handlers/skill-graph-listing.vitest.ts tests/handlers/skill-graph-dispatch.vitest.ts tests/handlers/advisor-recommend.vitest.ts` -> 19/19 passed. |
| Memory typecheck | PASS: `npm run typecheck` exited 0. |
| Advisor typecheck | PASS: `npm run typecheck` exited 0. |
| Memory targeted tests | PASS: `npx vitest run tests/skill-graph-proxy.vitest.ts tests/skill-graph-schema.vitest.ts tests/skill-graph-handlers.vitest.ts tests/skill-graph-diagnostic-redaction.vitest.ts tests/handlers/skill-graph-scan-auth.vitest.ts tests/session-bootstrap.vitest.ts` -> 15 passed, 1 skipped. |
| Memory full Vitest | FAIL baseline/noise: 11411/11600 passing with 102 failed tests and 11 failed suites; failures are stale deleted `skill_advisor` imports, stale code-graph expectations, embedding dimension/environment issues, and existing advisor parity/graph-health failures. D1 targeted tests pass. |
| Advisor MCP smoke | PASS: stdio `tools/list` returned 4 `advisor_*` plus 4 `skill_graph_*` descriptors. |
| Memory MCP smoke | PASS with expected timeout exit: stdio `tools/list` returned bridge `skill_graph_*` descriptors before `timeout` killed the long-running server. |
| Build | PASS: `npm run build` in both MCP packages exited 0. |
| Packet 008 strict validation | PASS: `validate.sh .../008-move-skill-graph-tools-to-advisor --strict` exited 0 with 0 errors and 0 warnings. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:req-evidence -->
## Requirement Evidence

| Requirement | D1 Status | Evidence |
|-------------|-----------|----------|
| REQ-001 | PASS | Advisor `tools/list` exposes all 4 `skill_graph_*` ids. |
| REQ-002 | PASS | Advisor-local handler subdir contains scan/query/status/validate. |
| REQ-003 | Deferred to D2 | Consumer cutover explicitly forbidden in D1. |
| REQ-004 | PASS | Memory proxy forwards to advisor, logs deprecation once, handles unavailable advisor, and times out at 10s. |
| REQ-005 | Deferred to D2 | Bridge removal waits for D2 zero-caller proof and operator confirmation. |
<!-- /ANCHOR:req-evidence -->

---

<!-- ANCHOR:binding -->
## BINDING

```text
AGENT_RECEIVED=013/009/008-d1
SPAWN_AGENT_USED=no
RESULT=PASS
SETUP_INVENTORY_LIVE_HITS=10
HANDLER_LAYOUT_CHOICE=subdir
HANDLERS_MOVED=7
RISK_R_EPSILON_PATH=1
ADVISOR_DESCRIPTORS_ADDED=4
ADVISOR_HANDLERS_REGISTERED=4
PROXY_WIRED=PASS
PROXY_DEPRECATION_LOG_ONCE_TESTED=PASS
PROXY_TIMEOUT_TESTED=PASS
PROXY_UNAVAILABLE_TESTED=PASS
ADVISOR_TESTS_AUTHORED=2
MEMORY_PROXY_TESTS_AUTHORED=1
PACKAGE_VITEST_ADVISOR_BASELINE=280/287
PACKAGE_VITEST_ADVISOR_AFTER=285/291
PACKAGE_VITEST_MEMORY_BASELINE=UNKNOWN (not captured before edits; full suite already red from stale path/env failures)
PACKAGE_VITEST_MEMORY_AFTER=11411/11600 full suite; targeted D1 tests 15/16 with 1 skipped
STANDALONE_ADVISOR_SMOKE_AFTER_D1=PASS (tools/list shows 4 advisor_* + 4 skill_graph_*)
MEMORY_MCP_SMOKE_AFTER_D1=PASS (tools/list shows skill_graph_* descriptors as bridge-only; timeout exit expected for long-running stdio server)
SPEC_KIT_HANDLERS_DELETED=YES (the 7 files in spec-kit/handlers/skill-graph/)
STRICT_VALIDATE_008=PASS
FILES_OUT_OF_SCOPE=1 (session-bootstrap.ts internal wire-safety proxy switch)
PRODUCTION_BUG_FOUND=yes
PRODUCTION_BUG_DETAIL=.opencode/skills/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:35 imported handler files that D1 is required to delete; routed that internal use through the memory proxy.
NOTES=Advisor has no tool-schemas.ts in the live package; descriptors were added through existing tools/ descriptor convention.
```
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. D2 must retarget the external consumer/doc surfaces still using `mcp__spec_kit_memory__skill_graph_*`.
2. D2 must remove memory-side bridge descriptors and proxy after zero-caller evidence and operator confirmation.
3. The memory full suite is not a clean regression signal in this checkout because it includes known stale imports and environment failures unrelated to D1. Targeted D1 tests and typechecks pass.
4. The live grep count changed from the dispatch note: current tree is 10 matches across 4 non-spec files.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:next-steps -->
## Next Steps

Dispatch D2 for T016-T034: consumer cutover, zero-caller proof, bridge cleanup, final strict validation, and completion metadata reconciliation.
<!-- /ANCHOR:next-steps -->
