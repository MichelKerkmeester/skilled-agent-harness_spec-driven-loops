---
title: "Feature Specification: Phase 11: push the open-item fixes and re-pin Barter onto them"
description: "Phase 009's Skilled fixes sit on local Skilled main. The operator pushes Skilled main, and an ai-speckit session then re-pins Barter onto the pushed commit and records a new base with the fixed record-base."
trigger_phrases:
  - "push and repin open items"
  - "phase 11 push and repin open items"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 11: push the open-item fixes and re-pin Barter onto them

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-11-20 |
| **Branch** | `main` in Skilled, then `main` in ai-speckit |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 12 |
| **Predecessor** | 010-barter-open-items |
| **Successor** | None |
| **Handoff Criteria** | Barter is pinned to the pushed Skilled commit and its `base.json` records that commit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the overlay framework/root layout packet. The push runs from the operator, and the re-pin from an ai-speckit session.

**Scope Boundary**: pushing Skilled main with the fixes of phases 009 and 012, re-pinning Barter onto the pushed commit, and recording the base. No new fixes.

**Dependencies**:
- Phase 009 merged into local Skilled main.
- Phase 012 merged into local Skilled main. This phase's push and re-pin run after phase 012, so the push carries the second review's Skilled fixes too.
- Phase 010's ai-speckit commits, so the re-pin starts from a clean ai-speckit.
- Barter's `fanout-run.cjs` overlay rebased onto the new upstream copy before the re-pin, because a stage to Skilled `HEAD` blocks on it until then, as ai-speckit's record 039 reports. With Barter's sibling `../overlays` folder, run `status --root` on the stage's `staged tree root:` path, not on the stage folder itself.

**Deliverables**:
- The pushed Skilled commit id, Barter's re-pin commit, and a `base.json` that records the pin.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 009's fixes exist only on local Skilled main, and Barter's `base.json` still records an older commit because `record-base` could not resolve the pin. Until Skilled is pushed and Barter re-pinned, Barter runs without the fixes.

### Purpose
Barter runs on the pushed Skilled commit that carries phase 009's fixes, and `record-base` records that commit.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
N/A: nothing has run yet. The push is the operator's and the re-pin belongs to a later ai-speckit session, which records its output here.
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Push Skilled main, done by the operator, and record the pushed commit id on this phase's `Target Skilled commit:` line.
- Re-pin Barter onto that commit through `/doctor:overlay repin`.
- Record the base with `/doctor:update record-base --pin <pushed id>`.

### Out of Scope
- New fixes in Skilled or ai-speckit - phases 009 and 010.

Target Skilled commit: not yet pushed; the operator's push sets it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| ai-speckit `skilled/` vendored tree, overlay manifest and `sync-state.json` | Modify | The re-pin |
| ai-speckit `skilled/.skilled/skills/.state/doctor-update/base.json` | Modify | The recorded base, written by the engine |
| `011-push-and-repin-open-items/*.md` | Modify | The pushed id and the re-pin record |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Skilled main carrying phase 009's merge is on origin | `git -C <Skilled> merge-base --is-ancestor <phase 009 merge> origin/main` exits 0 after a fetch |
| REQ-002 | Barter is pinned to the pushed commit | ai-speckit's overlay manifest `pin.commit` equals the `Target Skilled commit:` line |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | `record-base` records the pushed commit | `base.json` units name the pushed commit, and the engine exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: In ai-speckit `skilled/`, `node .skilled/commands/doctor/scripts/overlay-engine.cjs status --json` reports `PASSED` after the re-pin.
- **SC-002**: `validate.sh --strict` on this phase prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The operator's push of Skilled | The re-pin cannot start | The re-pin session reads the pushed id from this phase first |
| Risk | Origin moved since the last fetch | The push needs a merge first | Fetch and merge origin before the push, as phase 008 did |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The operator pushes Skilled, and ai-speckit re-pins after.
<!-- /ANCHOR:questions -->

---
