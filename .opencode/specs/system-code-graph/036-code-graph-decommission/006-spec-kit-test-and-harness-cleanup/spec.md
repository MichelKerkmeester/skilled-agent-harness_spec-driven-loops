---
title: "Feature Specification: Phase 6: spec-kit-test-and-harness-cleanup"
description: "Retire the spec-kit tests, stress harnesses, matrix-runner templates, and operational scripts that exist to exercise the code-graph coupling removed in phase 5, and rebaseline the search-quality corpus that was built on graph fixtures."
trigger_phrases:
  - "spec kit code graph test cleanup"
  - "search quality corpus rebaseline"
  - "launcher code index vitest removal"
  - "matrix runner code graph templates"
  - "036 spec kit test cleanup"
importance_tier: "important"
contextType: "testing"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/006-spec-kit-test-and-harness-cleanup"
    last_updated_at: "2026-07-27T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-006-spec-kit-test-and-harness-cleanup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: spec-kit-test-and-harness-cleanup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Not Started |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 15 |
| **Predecessor** | 005-spec-kit-runtime-decoupling |
| **Successor** | 007-skill-advisor-decoupling |
| **Handoff Criteria** | The spec-kit test suite passes with no skipped or deleted-module test, and the search-quality baseline is re-captured |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the code graph decommission specification.

**Scope Boundary**: Test, harness, fixture, and operational-script surface of `system-spec-kit`.

**Dependencies**:
- Phase 005 removed the production coupling these tests cover.

**Deliverables**:
- Tests that exist only to cover the removed coupling are deleted.
- Tests that cover a surviving behaviour are rewritten against the new payload shape.
- The search-quality corpus and baseline are rebuilt without graph fixtures.
- Matrix-runner templates and manifest entries for graph tools are removed.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Roughly fifty spec-kit test files reference the code graph, and they are not uniform: some exist solely to test the launcher lifecycle and boundary proxy and become meaningless, while others assert on session payloads that survive phase 005 in a changed shape. The search-quality stress corpus is built on code-graph fixtures, so its baseline numbers stop being comparable the moment the fixtures go. Deleting indiscriminately would drop real coverage; keeping indiscriminately leaves a red suite.

### Purpose
Leave a green, honest test suite: no test for a module that no longer exists, no silently weakened assertion, and a search-quality baseline that is re-measured rather than assumed unchanged.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Deleting launcher-lifecycle, boundary-proxy, and graph-routing test files.
- Rewriting session bootstrap, health, and context-server tests against the phase 005 payload.
- Rebuilding the search-quality corpus, harness, and measurement fixtures.
- Removing graph tool templates from the matrix runners and their manifest.
- Cleaning operational scripts and process harnesses that match the daemon.

### Out of Scope
- Production source changes — phase 005.
- Skill-advisor tests and benches — phase 007.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp-server/tests/launcher-code-index-*.vitest.ts` | Delete | Cover a removed launcher path |
| `.opencode/skills/system-spec-kit/mcp-server/tests/session-*.vitest.ts` | Modify | Rewrite against the new payload shape |
| `.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/**` | Modify | Rebuild corpus, harness, and baseline |
| `.opencode/skills/system-spec-kit/mcp-server/stress-test/substrate/**` | Modify | Remove launcher spawn from the harness |
| `.opencode/skills/system-spec-kit/mcp-server/matrix-runners/**` | Modify | Remove graph tool templates and manifest rows |
| `.opencode/skills/system-spec-kit/scripts/ops/**` | Modify | Remove daemon match patterns |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No test imports a deleted module | The suite runs with no unresolved import |
| REQ-002 | The suite is green, not skipped | No test is disabled to make the run pass |
| REQ-003 | A baseline is captured before and after | Pass and fail counts recorded on both sides, with the delta stated |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Surviving behaviour keeps its coverage | Each rewritten test still asserts the behaviour it originally covered |
| REQ-005 | Search-quality baseline is re-measured | New baseline numbers recorded; the old ones marked non-comparable |
| REQ-006 | Matrix manifest stays internally consistent | No manifest row points at a deleted template |
| REQ-007 | Deleted coverage is enumerated | The summary lists which assertions were dropped and why they no longer apply |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The full spec-kit suite passes, with before and after counts reported as a delta.
- **SC-002**: Dropped coverage is listed explicitly rather than disappearing silently.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Deleting a test that covered surviving behaviour | Silent coverage loss | REQ-007 forces an explicit enumeration |
| Risk | Baseline claimed unchanged without measurement | False no-regression claim | REQ-003 requires real numbers on both sides |
| Risk | Search-quality numbers compared across a fixture change | Misleading trend | Mark the old baseline non-comparable |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the search-quality harness retain value without graph fixtures, or does it retire with them?
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
