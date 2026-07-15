---
title: "Feature Specification: 056 Test Fixture Singular→Plural Sweep"
description: "Mechanical rename of singular `.opencode/skill/` paths in 7 advisor-test fixtures to plural `.opencode/skills/`, closing the 37 pre-existing test failures left from packet 096's path-residue rename."
trigger_phrases:
  - "030-test-fixture-singular-to-plural-sweep"
  - "advisor test 37 failures"
  - "test fixture singular skill"
  - "tempDir singular plural"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/030-test-fixture-singular-to-plural-sweep"
    last_updated_at: "2026-05-08T10:55:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author spec for the test-fixture singular→plural sweep"
    next_safe_action: "Apply sed across 7 advisor test files, then rerun advisor suite"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-freshness.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-status.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-030-test-fixture-singular-to-plural-sweep"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 056 Test Fixture Singular→Plural Sweep

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-08 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 56 of 56 |
| **Predecessor** | 029-autoclean-orphan-file-removal |
| **Successor** | None |
| **Handoff Criteria** | Advisor-suite failure count drops to 0 (or only failures unrelated to path rename remain) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Phase 56 of the 026/000 release-cleanup track. Closes the test-fixture residue from packet 096 (path-residue rename). Packet 054's diagnosis identified 37 advisor-suite failures whose root cause is fixture paths still using the singular `.opencode/skill/` form even though production code (per packet 096) uses plural `.opencode/skills/`. The fix is purely mechanical.

**Scope Boundary**: Touch ONLY test fixtures and the lifecycle test fixtures helper. NO production-code changes. NO behavior changes outside test setup.

**Dependencies**:
- Packet 096 path-residue rename (committed; see `cf696ce83`)
- Packet 054 diagnosis identifying the 37 failures (committed `88051ebaa`)

**Deliverables**:
- 30 path replacements across 7 test files (singular `.opencode/skill` → plural `.opencode/skills`).
- If needed, a stub `.opencode/skills/system-spec-kit/SKILL.md` written in fixture setup so the strict sentinel resolver succeeds in tests that exercise it.
- Pre/post advisor-suite failure counts captured in `scratch/`.

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 096 renamed production paths from singular `.opencode/skill/` to plural `.opencode/skills/`, but 7 advisor-test fixtures continued using the singular form. The mismatch causes 37 advisor-suite failures because the production code now expects plural paths and the resolver's strict sentinel (`.opencode/skills/system-spec-kit/SKILL.md`, hardened in packet 054 REQ-001) does not find a match in the fixture tempDir.

### Purpose
Restore advisor-suite green by aligning fixture paths with the production rename and adding the strict sentinel where the resolver runs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 7 test files under `mcp_server/skill_advisor/tests/`:
  - `legacy/advisor-freshness.vitest.ts` (5 occurrences)
  - `lifecycle-derived-metadata.vitest.ts` (2)
  - `daemon-watcher-resource-leaks-049-005.vitest.ts` (1)
  - `daemon-freshness-foundation.vitest.ts` (2)
  - `scorer/projection-fallback-049-005.vitest.ts` (3)
  - `scorer/native-scorer.vitest.ts` (3)
  - `handlers/advisor-status.vitest.ts` (14)
- Mechanical replacements:
  - `'.opencode', 'skill'` → `'.opencode', 'skills'`
  - `'.opencode/skill/` → `'.opencode/skills/`
  - Quoted-double variants if any.
- Optional stub: write `.opencode/skills/system-spec-kit/SKILL.md` in fixture setup if the resolver fires in the test path.

### Out of Scope
- Production-code paths (already plural per 096).
- Stress tests (`stress_test/skill-advisor/*.vitest.ts`) — those use string constants for parameter values, not fixture paths.
- Code-graph / smart-router / handler tests that reference `.opencode/skill` as a string constant for non-advisor purposes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/skill_advisor/tests/legacy/advisor-freshness.vitest.ts` | Modify | sed singular → plural (5 occ) |
| `mcp_server/skill_advisor/tests/lifecycle-derived-metadata.vitest.ts` | Modify | sed singular → plural (2 occ) |
| `mcp_server/skill_advisor/tests/daemon-watcher-resource-leaks-049-005.vitest.ts` | Modify | sed singular → plural (1 occ) |
| `mcp_server/skill_advisor/tests/daemon-freshness-foundation.vitest.ts` | Modify | sed singular → plural (2 occ) |
| `mcp_server/skill_advisor/tests/scorer/projection-fallback-049-005.vitest.ts` | Modify | sed singular → plural (3 occ) |
| `mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` | Modify | sed singular → plural (3 occ) |
| `mcp_server/skill_advisor/tests/handlers/advisor-status.vitest.ts` | Modify | sed singular → plural (14 occ) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 30 singular `.opencode/skill` references in the 7 affected test files become plural `.opencode/skills` | `rg -n "'\.opencode', 'skill'\|'\.opencode/skill/" mcp_server/skill_advisor/tests` returns 0 hits |
| REQ-002 | Advisor-suite failure count drops to ≤ 5 (target 0) after the sweep | `npx vitest run skill_advisor/tests/` reports failures ≤ 5; pre/post counts captured in `scratch/before.txt` and `scratch/after.txt` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | If the resolver `findAdvisorWorkspaceRoot` fires in any of the affected tests, fixture setup writes a stub `.opencode/skills/system-spec-kit/SKILL.md` so the strict sentinel from packet 054 succeeds | Test pass count is the canonical signal; if a residual failure traces to missing sentinel, add the stub |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Advisor-test failure count drops from 37 → 0 (or ≤ 5 with documented residual unrelated to path rename).
- **SC-002**: No production-code changes; only test-fixture files modified.
- **SC-003**: `validate.sh --strict` exits 0.
- **SC-004**: `npm run build` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A test asserts the singular literal in an error-message expectation | Low | Run tests after sed; any string-literal mismatch surfaces as a clear assertion failure |
| Risk | Some tests rely on the resolver's sentinel; sed alone won't fix them | Low–Med | REQ-003 covers the stub-SKILL.md path |
| Dependency | Build of dist not strictly required (test files only) | None | sed touches only `.ts` source under `tests/` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is the strict sentinel actually exercised in the test paths? — answered by running tests post-sed and inspecting any residual failure traces.
<!-- /ANCHOR:questions -->

---
