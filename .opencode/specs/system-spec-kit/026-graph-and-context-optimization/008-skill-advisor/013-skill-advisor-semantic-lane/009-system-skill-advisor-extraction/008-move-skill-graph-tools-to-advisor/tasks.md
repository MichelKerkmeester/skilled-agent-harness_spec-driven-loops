---
title: "Tasks: Move skill_graph_* tools to advisor ownership"
description: "Pending Level 3 task list for registering skill_graph_* on system_skill_advisor, cutting over consumers, and removing memory-side ownership."
trigger_phrases:
  - "013/009/008 tasks"
  - "skill graph advisor move tasks"
importance_tier: "critical"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/013-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/008-move-skill-graph-tools-to-advisor"
    last_updated_at: "2026-05-14T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Packet scaffolded by cli-codex"
    next_safe_action: "Start T001 inventory"
    blockers: []
    completion_pct: 0
---
# Tasks: Move skill_graph_* tools to advisor ownership

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort] {deps: T###}`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Target |
|-----------|-------|--------|
| M1 | T001-T006 | Setup inventory complete |
| M2 | T007-T015 | Advisor registration and proxy complete |
| M3 | T016-T022 | Consumer cutover complete |
| M4 | T023-T030 | Cleanup and verification complete |
| M5 | T031-T034 | Docs and packet closeout complete |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 Read parent handover, 001 ADR, 004/005/006 specs, 005/006 ADRs, 007 spec/summary, and this packet's docs. [30m]
  - Evidence: Required packet docs, 005 proxy summary, 003 handler move summary, existing handlers, schemas, and advisor server conventions were read before edits.
- [x] T002 Run full live grep for `skill_graph_(scan|query|status|validate)` and `mcp__spec_kit_memory__skill_graph_`; record file and match counts. [20m]
  - Evidence: Live old-prefix grep returned 10 matches across 4 non-spec files; D2 consumer surfaces were not edited.
- [x] T003 Inventory current `spec_kit_memory` registration files: `tool-schemas.ts`, `schemas/tool-input-schemas.ts`, `tools/index.ts`, `tools/skill-graph-tools.ts`, and handler tests. [30m]
  - Evidence: `tool-schemas.ts` kept four bridge descriptors; `tools/index.ts` still exports `skillGraphTools`; `tools/skill-graph-tools.ts` replaced with proxy.
- [x] T004 Inventory handler dependencies for scan, query, status, and validate. [40m]
  - Evidence: Handler imports were limited to `lib/skill-graph/*`, caller context, trusted-caller/freshness helpers, and local response envelope.
- [x] T005 Capture baseline `system-skill-advisor/mcp_server` Vitest pass count. [30m]
  - Evidence: Baseline `npm test` was 280 passed / 287 total, 4 failed tests plus 1 failed suite and 3 skipped.
- [x] T006 Decide final advisor handler layout and update this task list if implementation discovers a cleaner local convention. [15m] {deps: T004}
  - Evidence: Chose `handlers/skill-graph/` subdir to preserve the existing `response-envelope.ts`, `index.ts`, and README harness.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

### Cluster A - Advisor Registration

- [x] T007 Add `skill_graph_*` descriptors and input schemas to advisor tool schema files. [45m] {deps: T003, T004}
  - Evidence: Added four descriptors in `system-skill-advisor/mcp_server/tools/skill-graph-tools.ts` and exported them through `tools/index.ts`.
- [x] T008 Implement advisor-local `skill_graph_scan` handler. [45m] {deps: T004, T007}
  - Evidence: Moved `scan.ts` to `system-skill-advisor/mcp_server/handlers/skill-graph/scan.ts`.
- [x] T009 Implement advisor-local `skill_graph_query` handler. [45m] {deps: T004, T007}
  - Evidence: Moved `query.ts` to `system-skill-advisor/mcp_server/handlers/skill-graph/query.ts`.
- [x] T010 Implement advisor-local `skill_graph_status` handler. [45m] {deps: T004, T007}
  - Evidence: Moved `status.ts` to `system-skill-advisor/mcp_server/handlers/skill-graph/status.ts`.
- [x] T011 Implement advisor-local `skill_graph_validate` handler. [45m] {deps: T004, T007}
  - Evidence: Moved `validate.ts` to `system-skill-advisor/mcp_server/handlers/skill-graph/validate.ts`.
- [x] T012 Register all four handlers in `advisor-server.ts` dispatch. [30m] {deps: T008, T009, T010, T011}
  - Evidence: `advisor-server.ts` lists 8 tools and dispatches `skill_graph_*` through advisor-local `skillGraphTools`.
- [x] T013 Add advisor package tests for tool listing, schema validation, and handler dispatch. [60m] {deps: T012}
  - Evidence: Added `skill-graph-listing.vitest.ts` and `skill-graph-dispatch.vitest.ts`; targeted advisor handler tests pass 19/19.

### Cluster B - Memory Proxy

- [x] T014 Add temporary memory-side proxy descriptors and dispatchers mirroring 005 ADR-003. [45m] {deps: T012}
  - Evidence: Replaced `system-spec-kit/mcp_server/tools/skill-graph-tools.ts` with stdio MCP proxy and annotated memory descriptors as bridge-only.
- [x] T015 Add proxy tests for forwarding, once-only deprecation log, unavailable-server response, and 10s timeout path. [45m] {deps: T014}
  - Evidence: Added `skill-graph-proxy.vitest.ts`; targeted memory proxy/handler/bootstrap tests pass 15 passed, 1 skipped.

### Cluster C - Consumer Cutover

- [ ] T016 Retarget system-code-graph readiness/report callers to `mcp__system_skill_advisor__skill_graph_*`. [45m] {deps: T014}
- [ ] T017 Retarget hook wrappers across OpenCode, Codex, Claude, and Gemini surfaces. [45m] {deps: T014}
- [ ] T018 Retarget plugin bridges and plugin docs. [45m] {deps: T014}
- [ ] T019 Retarget doctor command allowed-tools and route YAMLs. [45m] {deps: T014}
- [ ] T020 Retarget install guides, `ARCHITECTURE.md`, feature catalogs, and playbooks. [60m] {deps: T014}
- [ ] T021 Run intermediate grep and classify remaining hits as live, proxy, or historical. [30m] {deps: T016, T017, T018, T019, T020}
- [ ] T022 Get operator confirmation for proxy removal after zero live old-server callers are proven. [10m] {deps: T021}

### Cluster D - Deprecation Removal

- [ ] T023 Remove `skill_graph_*` descriptors and schemas from `spec_kit_memory`. [45m] {deps: T022}
- [ ] T024 Remove memory-side proxy dispatch and stale primary handler registrations. [45m] {deps: T023}
- [ ] T025 Delete or retire memory-owned skill-graph handler files only after advisor tests pass and no imports remain. [45m] {deps: T024}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T026 Run advisor package Vitest and record pass/fail count. [30m] {deps: T025}
- [ ] T027 Run targeted memory MCP tests proving no primary `skill_graph_*` registration remains. [30m] {deps: T025}
- [ ] T028 Run system-code-graph readiness smoke and hook wrapper smoke. [45m] {deps: T016, T017}
- [ ] T029 Run four-runtime smoke matrix for OpenCode, Codex, Claude, and Gemini. [60m] {deps: T026}
- [ ] T030 Run doctor/update smoke that exercises advisor-owned skill graph probes. [45m] {deps: T019}
- [ ] T031 Run final grep proving zero live `mcp__spec_kit_memory__skill_graph_` callers outside historical specs. [20m] {deps: T023, T024, T025}
- [ ] T032 Run strict validation for packet 008. [15m] {deps: T031}
- [ ] T033 Run strict validation for parent 013/009 and grandparent 013. [20m] {deps: T032}
- [ ] T034 Update `implementation-summary.md`, `checklist.md`, and metadata with evidence without marking complete until all P0/P1 gates pass. [45m] {deps: T026, T027, T028, T029, T030, T031, T032, T033}
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks complete.
- [ ] No `[B]` blocked tasks remain.
- [ ] `system_skill_advisor` exposes all four `skill_graph_*` tools.
- [ ] `spec_kit_memory` no longer owns or registers primary `skill_graph_*` tools.
- [ ] Four-runtime smoke matrix recorded.
- [ ] Strict validation passes at packet, parent, and grandparent levels.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Checklist**: See `checklist.md`.
- **Decisions**: See `decision-record.md`.
- **Implementation Summary**: See `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
