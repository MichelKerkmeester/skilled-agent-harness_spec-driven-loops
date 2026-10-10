---
title: "Feature Specification: Post-merge deep review"
description: "The 092 epic landed on main through a merge that resolved eight conflicts. This phase runs ten deep-review iterations over the forty commits to confirm the work is intact and to find errors and open ends."
trigger_phrases:
  - "post merge deep review"
  - "phase 12 post merge deep review"
  - "092 epic review on main"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Post-merge deep review

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/093-post-merge-deep-review` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 12 |
| **Predecessor** | 011-round-four-remediation |
| **Successor** | None |
| **Handoff Criteria** | Ten review iterations recorded, a review report with ranked recommendations, strict validation passed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the sk-code Ponytail 5 refinement. It reviews the epic after it reached main.

**Scope Boundary**: Read-only review of the commits `ba56b03412..5d9c970447` on main. The only writes are this packet's own docs and its `review/` state.

**Dependencies**:
- Phases 002 to 011 committed and merged to main at `144b1d339e`
- The cli-pi DevPass route `llmgateway/deepseek-v4.1-flash` at `--thinking max`

**Deliverables**:
- `review/` state for ten iterations and `review/review-report.md` with ranked recommendations
- Confirmed or refuted status for each known open item listed below

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 092 epic shipped 37 commits, then a merge brought in 45 upstream commits and resolved eight conflicts by hand. No review has checked the result on main, and the round-four children each left items in their Known Limitations.

### Purpose
Confirm that the epic's work survived the merge intact, and record every error and open end with evidence and a ranked fix.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The 40 commits `ba56b03412..5d9c970447`: 37 epic commits, the merge `144b1d339e`, then `9a74576ccc` and `5d9c970447`
- The merge resolution of `generate-leaf-manifest.cjs`, system-spec-kit `SKILL.md`, changelog `v2.7.1.0` and `v2.7.2.0`, the trigger index, three retrieval fixtures and the Hermes copy
- Known open items: the jev-transport-single canary defer, the compiled-route-admission corpus pin, the failing manifest tests, the advisor battery, the HVR blockers in sk-code `SKILL.md`, the 500 ms hook stdin deadline, the reducer's open-finding drop and the missing `--surface-hint` pass-through
- The Known Limitations of every child of `011-round-four-remediation`

### Out of Scope
- Fixing product code - this phase reviews only; fixes go to the report as ranked recommendations
- The 45 upstream commits on their own merits - only their interaction with the epic is in scope

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `012-post-merge-deep-review/` | Create | This packet's docs and `review/` state |
| `../spec.md`, `../goal.md` | Modify | Phase map and binding rows for this phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run ten `/deep:review` iterations on cli-pi DeepSeek V4.1 Flash at max effort | `review/deep-review-state.jsonl` holds ten iteration records with `executor.kind` `cli-pi` |
| REQ-002 | Keep only findings a rerun command or a read line proves | Each kept finding in `review/review-report.md` carries a CONFIRMED tag and its evidence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Check the merge resolution explicitly | The report has a merge-resolution section covering all eight conflicted files |
| REQ-004 | Confirm or refute each known open item | The report lists each known item as confirmed or refuted with evidence |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Ten iteration records exist and the review report ranks every confirmed finding P0, P1 or P2.
- **SC-002**: No product file outside this packet changes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | DevPass gateway route | No iterations run | Fall back to `cline-pass/deepseek-v4.1-flash` |
| Risk | Executor reports unproven findings | High | Rerun or read every finding before keeping it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at start.
<!-- /ANCHOR:questions -->

---
