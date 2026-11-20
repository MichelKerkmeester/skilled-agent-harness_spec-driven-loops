---
title: "Feature Specification: Phase 10: close the Barter-side open items of the overlay layout"
description: "The overlay layout re-pin left open items that live in ai-speckit, not Skilled. A parallel ai-speckit session fixes them and records the work in ai-speckit's spec record 039. This phase records that work here once it lands."
trigger_phrases:
  - "barter open items"
  - "phase 10 barter open items"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 10: close the Barter-side open items of the overlay layout

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
| **Branch** | `main` in ai-speckit |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 11 |
| **Predecessor** | 009-skilled-open-items |
| **Successor** | 011-push-and-repin-open-items |
| **Handoff Criteria** | The Barter-side items are fixed in ai-speckit commits, and record 039 names each commit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the overlay framework/root layout packet. It runs in ai-speckit, from a parallel session, and is recorded here.

**Scope Boundary**: the open items that live in ai-speckit. The Skilled-side items are phase 009, and the push and re-pin are phase 011.

**Dependencies**:
- ai-speckit's record `specs/skilled-barter-overlays/002-spec-tracks-restructure/039-overlays-framework-root-layout/`, whose Known Limitations list the items.

**Deliverables**:
- ai-speckit commits that fix the Barter-side items, recorded in record 039 and summarized here.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The re-pin of Barter onto the overlay layout fixes left items open in ai-speckit. Phase 008's Known Limitations name some of them: upstream's root `.gitignore` line for `orchestration-status.log` was not carried in, the vibe mirror drift predates the re-pin, and one deep-loop vitest case fails on Barter's Pi default. Record 039 holds the full list.

### Purpose
Every Barter-side open item in record 039 is fixed in an ai-speckit commit or named as deferred, and this phase records which.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
N/A: this phase runs in ai-speckit from another session. Its measured behavior is recorded in ai-speckit's record 039, and a later session copies the results here.
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix the Barter-side open items record 039 lists, in ai-speckit.
- Record each fixing commit and its gate results in this phase's `implementation-summary.md`.

### Out of Scope
- The Skilled-side items - phase 009 fixes them in Skilled.
- The push of Skilled and the re-pin onto it - phase 011.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| ai-speckit files named in record 039 | Modify | The Barter-side fixes, chosen by the ai-speckit session |
| `010-barter-open-items/implementation-summary.md` and `tasks.md` | Modify | The record of that work, written by a later session |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each Barter-side item in record 039 is fixed or named as deferred | Record 039 names a commit or a deferral for each item |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | This phase records the ai-speckit commits | `implementation-summary.md` lists each commit id with `git -C <ai-speckit> show --stat <id>` evidence |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Barter's own gates pass on the ai-speckit commit that closes the items.
- **SC-002**: `validate.sh --strict` on this phase prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The parallel ai-speckit session | This record stays planned until it lands | A later session fills this phase from record 039 |
| Risk | This record drifts from record 039 | Two records disagree | Record 039 is authoritative; this phase quotes it and names its path |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None here. The ai-speckit session owns the choice of fixes.
<!-- /ANCHOR:questions -->

---
