---
title: "Implementation Plan: Phase 015 Package Relocation Into Skill"
description: "Complete the package-relocation boundary through a rename-preserving git mv, skill-doc reference updates, independent verification, and strict packet closeout."
trigger_phrases:
  - "package-into-skill"
  - "implementation plan"
  - "package relocation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/015-package-into-skill"
    last_updated_at: "2026-08-13T17:10:00.000Z"
    last_updated_by: "claude"
    recent_action: "Recorded the completed relocation plan and verification path."
    next_safe_action: "Preserve the relocation and reference gates when the package or skill docs change."
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
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
      - "The completed work uses git rename tracking and a scoped skill-doc reference sweep as independent relocation gates."
      - "The package gate from the new location provides the implementation-alignment evidence."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Phase 015 Package Relocation Into Skill

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript package nested inside a skill-scoped documentation tree |
| **Framework** | `git mv` rename tracking; sk-communication skill documentation set; system-spec-kit Level-2 closeout |
| **Storage** | Repository files only; no persistence or schema change |
| **Testing** | Git rename-status inspection, path-reference sweep, recorded `npm run check`, and strict packet validation |

### Overview

Close the completed relocation by proving preserved rename history, exhaustive skill-doc reference coverage, package-gate evidence from the new location, and wiring Phase 015 into the parent packet. The result is a self-contained evidence packet, not a behavior change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The move source and destination paths are explicit. [evidence: `packages/cli-communication-projection` -> `.opencode/skills/sk-communication/cli-communication-projection`]
- [x] The skill-doc reference inventory is defined. [evidence: 24 documents, 140 references enumerated]
- [x] Package evidence from the new location is available. [evidence: 289 of 289 tests]

### Definition of Done

- [x] All six requirements have observed evidence. [evidence: `checklist.md` and `implementation-summary.md`]
- [x] Every skill-doc reference points to the new path with zero remaining legacy references in scope. [evidence: 140/140 references updated]
- [x] Phase 015 and its parent pass strict validation with zero errors and warnings. [evidence: final `validate.sh --strict` runs]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Rename-preserving relocation with independent inventory, reference-update, implementation-alignment, and packet-integrity gates.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| Git rename tracking | Proves the move preserved history across all 207 files |
| Skill-doc reference inventory and update | Points all 140 references at the new path across 24 documents |
| Package-gate receipt | Establishes implementation alignment from the new location |
| Phase packet and parent wiring | Preserve strict conformance, navigation, and graph truth |

### Data Flow

Move inventory -> rename-preserving `git mv` -> skill-doc reference sweep -> package-gate receipt -> Level-2 completion evidence -> phase and parent strict validation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Package directory | Public package source, tests, and config | Completed: relocate via `git mv` | 207/207 R-status renames, 0 additions, 0 deletions |
| sk-communication skill documents | Explain skill capabilities and package usage | Completed: update 140 path references | Reference sweep across 24 documents |
| Historical spec/research references | Append-only record of prior package state | Unchanged | Reference sweep confirms the legacy path stays untouched under `specs/` |
| Package implementation | Supplies runtime behavior behind the docs | Unchanged; verify alignment from new path | `npm run check` passes 289/289 |
| Phase and parent packet docs | Record and route completion state | Create Phase 015 and wire parent/014 links | Strict validation and graph backfill |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Inventory the package's tracked files and the skill-doc reference set. [evidence: 207 tracked files, 24 documents, 140 references]
- [x] Load the sk-communication skill's existing documentation and the package-move contract. [evidence: `README.md`, `SKILL.md`, `benchmark/README.md`, `references/package-map.md`, `feature-catalog/`, `manual-testing-playbook/`]

### Phase 2: Implementation

- [x] Execute `git mv` from `packages/cli-communication-projection` to `.opencode/skills/sk-communication/cli-communication-projection`. [evidence: 207 files renamed, 0 additions, 0 deletions]
- [x] Remove the now-empty `packages/` directory. [evidence: directory absent after move]
- [x] Update all 140 path references across 24 sk-communication documents. [evidence: `README.md`, `SKILL.md`, `benchmark/README.md`, `references/package-map.md`, `feature-catalog/`, `manual-testing-playbook/`]

### Phase 3: Verification

- [x] Confirm the package gate passes 289 of 289 tests from the new location. [evidence: `npm run check`: typecheck, build, tests, public-import smoke]
- [x] Confirm no package config references a path outside the package. [evidence: move-safety check]
- [x] Author the Level-2 completion packet, wire Phase 015, backfill metadata, and pass both strict validators. [evidence: final packet and parent receipts]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Rename integrity | 207 tracked package files | `git status`/`git log` rename detection |
| Reference sweep | 140 references across 24 documents | Path search across the sk-communication tree |
| Implementation alignment | Typecheck, build, 289 tests, public-import smoke | `npm run check` from the new location; isolated rerun of the known latency test to confirm load-sensitivity, not regression |
| Historical-record integrity | Existing references under `specs/` | Path search confirms unchanged |
| Packet integrity | Phase 015 plus parent map, links, and metadata | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Git rename tracking | Internal | Available and confirmed | Move history cannot be proven preserved |
| sk-communication skill documentation set | Internal | Available and updated | Skill docs would point at a non-existent path |
| Completed package gate from the new location | Evidence | Available: 289/289 | Implementation alignment cannot be claimed |
| system-spec-kit metadata and strict validator | Internal | Available | Packet and parent cannot be closed cleanly |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A path reference regresses to the legacy location, the package gate fails from the new path, or parent navigation becomes inconsistent.
- **Procedure**: `git mv` the package back to `packages/cli-communication-projection`, revert the 24 skill-doc reference edits, rerun `npm run check`, refresh graph metadata, and rerun Phase 015 plus parent strict validation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Inventory and contracts -> Rename-preserving move -> Reference and package evidence -> Packet and parent closeout
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Inventory and contracts | Maintained package and skill-doc structure | Rename-preserving move |
| Rename-preserving move | Complete inventory | Reference and package evidence |
| Reference and package evidence | Completed move | Packet closeout |
| Packet and parent closeout | All relocation evidence | Phase handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Inventory and move execution | Low | 0.5 day |
| Skill-doc reference updates | Medium | 0.5-1 day |
| Verification and packet closeout | Low | 0.5 day |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Change Checks

- [x] Record the current 207-file package inventory. [evidence: tracked files under `packages/cli-communication-projection` before the move]
- [x] Record the 24-document, 140-reference skill-doc inventory. [evidence: `README.md`, `SKILL.md`, `benchmark/README.md`, `references/package-map.md`, `feature-catalog/`, `manual-testing-playbook/`]
- [x] Confirm package source and tests are outside this documentation-only closeout. [evidence: 0 additions, 0 deletions in the move]

### Procedure

1. Restore only the path or packet link that regressed.
2. Rerun `npm run check` from the restored location when applicable.
3. Refresh the affected graph metadata.
4. Rerun strict validation for Phase 015 and the parent.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Restore the package directory and skill documentation only; no runtime or persisted user data is changed.
<!-- /ANCHOR:enhanced-rollback -->
