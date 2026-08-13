---
title: "Feature Specification: Phase 015 Package Relocation Into Skill"
description: "Record the completed relocation of the CLI communication projection package into its owning sk-communication skill, including rename-preserving move and path updates across 24 skill documents."
trigger_phrases:
  - "package-into-skill"
  - "package into skill"
  - "cli communication projection relocation"
  - "package relocation evidence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/015-package-into-skill"
    last_updated_at: "2026-08-13T19:03:35.000Z"
    last_updated_by: "claude"
    recent_action: "Recorded the completed package relocation into the sk-communication skill."
    next_safe_action: "Preserve the relocation and reference gates when the package or skill docs change."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-015-relocation-20260813"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All 207 tracked package files show R-status renames with zero additions and zero deletions."
      - "All 140 path references across 24 sk-communication documents point to the new package location."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Phase 015 Package Relocation Into Skill

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

The CLI communication projection package now lives inside the sk-communication skill that owns and exclusively consumes it, mirroring how system skills such as system-spec-kit bundle their code inside the skill directory. This phase records that completed relocation together with the preserved 207-file rename history and the 140 skill-document path references that now point at the new location.

**Key decision:** package location follows skill ownership, and the move is functionally transparent because it changes only paths, never package behavior.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-13 |
| **Branch** | Current worktree |
| **Parent Spec** | `../spec.md` |
| **Phase** | 15 of 15 |
| **Predecessor** | `014-code-and-doc-conformance` |
| **Successor** | `016-default-off-and-advisor-exclusion` |
| **Handoff Criteria** | The package lives at `.opencode/skills/sk-communication/cli-communication-projection` with rename history preserved, all 24 skill documents reference the new path, `npm run check` passes 289 of 289 tests from the new location, and this phase plus the parent pass strict validation with zero errors and warnings. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This completed phase closes the package-relocation workstream that nests the CLI communication projection package inside its owning skill.

**Scope boundary**: Document and verify the completed git-mv relocation and skill-doc reference updates. Do not change package source, tests, or historical spec references.

**Dependencies**:

- The completed package implementation and 289-test gate at the new location
- The sk-communication skill's existing documentation set
- Git rename tracking for the moved files

**Deliverables**:

- Package relocated to `.opencode/skills/sk-communication/cli-communication-projection` with 207 R-status renames, 0 deletions, 0 additions
- 24 sk-communication documents (140 path references) updated from `packages/cli-communication-projection` to the new path
- Final-state verification evidence: `npm run check` 289 of 289 tests from the new location
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The package lived under a generic `packages/` root even though it is owned and consumed exclusively by the sk-communication skill, unlike system skills (for example, system-spec-kit) that bundle their code inside the skill directory. This left package ownership implicit and diverged from the established system-skill pattern.

### Purpose

Move the package inside its owning skill so ownership is explicit and consistent with system-skill conventions, without changing any runtime behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Relocate `packages/cli-communication-projection` to `.opencode/skills/sk-communication/cli-communication-projection` via `git mv`, preserving rename history.
- Remove the now-empty `packages/` directory.
- Update 24 sk-communication skill documents (140 references) from the old path to the new path.
- Verify `npm run check` passes from the new location.

### Out of Scope

- Any change to package source or test files, because the move is 207 R-status renames with 0 additions and 0 deletions.
- Any change to historical spec or research references under `specs/` (intentionally left unchanged as an append-only record of prior state).
- Any `.gitignore` change, because `node_modules`, `dist`, and `coverage` move with the package and stay covered by the repository's generic patterns.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `packages/cli-communication-projection/**` -> `.opencode/skills/sk-communication/cli-communication-projection/**` | Rename | `git mv` the package into its owning skill: 207 files, R-status, 0 additions, 0 deletions |
| `.opencode/skills/sk-communication/README.md`, `SKILL.md`, `benchmark/README.md`, `references/package-map.md`, `feature-catalog/**`, `manual-testing-playbook/**` | Modify | Update 140 path references across 24 documents from the old to the new package path |
| `015-package-into-skill/` | Create | Record the completed Level-2 relocation packet and final-state evidence |
| `../spec.md`, `../graph-metadata.json`, `../014-code-and-doc-conformance/spec.md` | Modify | Add Phase 015 to the map, transition chain, and graph |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Relocate the package with rename history preserved. | `git mv` reports 207 files as R-status renames with 0 additions and 0 deletions. |
| REQ-002 | Remove the now-empty legacy directory. | `packages/` no longer exists after the move. |
| REQ-003 | Update every skill-doc path reference. | All 140 references across 24 sk-communication documents point to `.opencode/skills/sk-communication/cli-communication-projection`. |
| REQ-004 | Preserve historical spec records unchanged. | Existing references under `specs/` remain untouched by this phase's reference sweep. |
| REQ-005 | Preserve implementation alignment from the new location. | `npm run check` passes typecheck, build, 289 of 289 tests, and the public-import smoke, with no package config referencing a path outside the package; the known full-gate latency flake (see NFR-P02) does not block this criterion. |
| REQ-006 | Close the documentation packet. | The Phase 015 packet and parent packet each pass `validate.sh --strict` with zero errors and zero warnings. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Git rename status confirms 207 R-status renames, 0 additions, 0 deletions, and no `packages/` directory remains.
- **SC-002**: A reference sweep confirms all 140 references across the 24 sk-communication documents resolve to the new path with zero legacy-path hits.
- **SC-003**: `npm run check` reports 289 of 289 tests passing from the new location with no package config referencing a path outside the package; the pre-existing full-gate-load latency flake is recorded rather than treated as a move-caused defect.
- **SC-004**: Phase and parent strict validators each report `Errors: 0  Warnings: 0`.

### Acceptance Scenarios

1. **Given** the git history for the move, **When** the rename status is inspected, **Then** it reports 207 renamed files, 0 additions, and 0 deletions.
2. **Given** the 24 sk-communication documents, **When** path references are searched, **Then** all 140 references resolve to the new nested path.
3. **Given** the historical specs directory, **When** searched for the old path, **Then** the pre-existing references remain unchanged.
4. **Given** the completed packet and parent links, **When** strict validation runs, **Then** both targets report zero errors and zero warnings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `git mv` rename tracking | High | Confirm 207 of 207 R-status entries before treating history as preserved. |
| Dependency | Package-gate evidence from the new location | High | Pin the result to 289 of 289 tests run after the move. |
| Risk | A stray reference to the old path breaks a doc or link | Medium | Scan the sk-communication skill tree for the legacy path after updating. |
| Risk | Parent link chain omits the new final phase | Medium | Add Phase 015 to the phase map, 014 successor, transition chain, and graph children, then backfill. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The relocation is a repository-only change; verification remains deterministic and requires no network access.
- **NFR-P02**: The known fidelity-pipeline latency test may be flaky under full-gate concurrent load (it passes in isolation), but the authoritative recorded gate must still complete with 289 of 289 tests.
- **NFR-P03**: `node_modules`, `dist`, and `coverage` move with the package and remain gitignored by the repository's generic patterns without a `.gitignore` edit.

### Security and Privacy

- **NFR-S01**: The move and doc updates contain no credentials, message content, or protected spans.

### Reliability

- **NFR-R01**: Re-running the suite in isolation, or a quiet full-gate run, reproduces the same 289 of 289 result from the new location.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- `node_modules`, `dist`, and `coverage` move with the package tree and require no separate handling.
- Record the fidelity-pipeline latency test as known-flaky only under full-gate concurrent load; do not convert an intermittent, load-sensitive observation into a move-caused defect claim.
- Historical spec and research references under `specs/` are append-only and must not be rewritten even though they cite the old path.
- Package config files must contain no path that resolves outside the package after the move (move-safety check).
- The now-empty `packages/` directory must be removed rather than left as a stale root.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | One rename-preserving move plus 24 skill documents and 140 references |
| Risk | 8/25 | Low behavioral risk; reference drift is the main failure mode |
| Research | 6/20 | Existing skill-bundling precedent, sibling packets, and validators |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

No unresolved question blocks completion.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Implementation Summary**: `implementation-summary.md`
- **Parent Packet**: `../spec.md`
