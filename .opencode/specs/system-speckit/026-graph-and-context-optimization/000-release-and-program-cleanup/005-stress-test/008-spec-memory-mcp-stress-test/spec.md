---
title: "008: mk-spec-memory comprehensive stress test"
description: "Exercise all 39 mk-spec-memory MCP tools and execute all 345 manual_testing_playbook scenarios via cli-devin SWE-1.6 to validate behavior post-113 z_archive un-exclusion."
trigger_phrases:
  - "008 spec"
  - "mk-spec-memory stress test"
  - "manual testing playbook full run"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/008-spec-memory-mcp-stress-test"
    last_updated_at: "2026-05-16T13:55:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded 008 phase with handover"
    next_safe_action: "Run baseline checks then dispatch Phase 1"
    blockers: []
    key_files:
      - "handover.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000008000"
      session_id: "008-spec-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Executor: cli-devin SWE-1.6"
      - "Scope: 39 tools + 345 scenarios"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# 008: mk-spec-memory comprehensive stress test

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| Target Level | 1 |
| Priority | P1 |
| Status | Complete - 345/345 coverage; 51/51 failures closed |
| Created | 2026-05-16 |
| Branch | `main` |
| Predecessor | `113-z-archive-memory-indexing` |
| Handover entry-point | `handover.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Packet 113 un-excluded z_archive from `EXCLUDED_FOR_MEMORY` (commit b062b12b4). 2618 archived rows are now indexed with 0.1 decay multiplier. Behavior under load + scoring fidelity needs validation against the canonical 345-scenario manual testing playbook and the full 39-tool mk-spec-memory surface. The 113 fix shipped narrow targeted tests (159 vitest assertions); this packet runs the broad real-traffic equivalent.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Phase 1: every one of 39 mk-spec-memory tools exercised (happy path + 1 edge case)
- Phase 2: every one of 345 manual_testing_playbook scenarios executed against the post-113 build
- Phase 3: z_archive-aware reclassification of scenarios that legitimately expected 0 archived rows
- Phase 4: synthesis report + memory save

### Out of Scope

- code-graph stress test (separate MCP server, separate scope rules — packet 115+ if needed)
- skill-advisor stress test (separate packet)
- cocoindex stress test (separate packet)
- Fixing regressions surfaced by Phase 2 — those get follow-on packets (115, 116, ...)

### Files to Change

| Path | Change | Description |
|------|--------|-------------|
| `evidence/tool-sweep.jsonl` | Create | Per-tool result row |
| `evidence/playbook-results.jsonl` | Create | Per-scenario result row |
| `evidence/agent-config-008.json` | Create | cli-devin recipe override |
| `implementation-summary.md` | Create | Aggregated report |
| Manual testing playbook scenarios with z_archive assertions | Update | Reclassify in-place if assertion drifted (with packet 008 attribution) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every 39 mk-spec-memory tool has a result row | `wc -l evidence/tool-sweep.jsonl` ≥ 39 |
| REQ-002 | Every 345 playbook scenario has a result row | `wc -l evidence/playbook-results.jsonl` ≥ 345 |
| REQ-003 | All results carry one of {PASS, FAIL, SKIP, UNAUTOMATABLE, PARTIAL} | grep-check for invalid classifications returns empty |
| REQ-004 | z_archive row count still ≥ 2618 post-sweep | DB query confirms |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | All PARTIAL classifications have a z_archive-impact note | grep "z_archive" in PARTIAL rows returns ≥1 hit per row |
| REQ-006 | Pre-sweep checkpoint exists | `checkpoint_list` shows a `pre-008-sweep-<timestamp>` entry |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Aggregate PASS ratio reported (target ≥ 80% across both surfaces)
- **SC-002**: All genuine FAILs documented with reproduction evidence
- **SC-003**: 008 strict-validate exit 0
- **SC-004**: Follow-on packet list (115+) generated for any regressions
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Sweep mutates DB state mid-run | High | Pre-sweep checkpoint via `checkpoint_create`; restore after Phase 4 if needed |
| Risk | cli-devin parallelism flakiness | Med | Cap at 2 concurrent (per memory note) |
| Risk | False FAILs from z_archive expectation drift | Med | Phase 3 reclassification pass |
| Risk | Wall-clock exceeds 6h | Low | Categories can be deferred to follow-on packets |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Dispatch cadence (paired vs sequential) — defaults to paired per packet 113 precedent
- Stop-on-first-fail vs run-to-completion — recommend run-to-completion
- Memory baseline checkpoint name — suggest `pre-008-sweep-<UTC>`

Full handover for the new session: see `handover.md`.
<!-- /ANCHOR:questions -->
