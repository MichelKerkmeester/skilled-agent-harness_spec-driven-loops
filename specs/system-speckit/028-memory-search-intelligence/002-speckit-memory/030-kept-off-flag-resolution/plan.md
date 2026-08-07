---
title: "Implementation Plan: Kept-Off Flag Resolution"
description: "Method and verification route for the final flip-or-delete reckoning: real-world simulation as the live signal, a fresh-Opus per-flag gate and a 4-layer verification, then a documentation reconciliation to the keep 5 and delete 10 reality."
trigger_phrases:
  - "028 flag resolution plan"
  - "028 flip or delete method"
  - "028 real world simulation flag gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-speckit-memory/030-kept-off-flag-resolution"
    last_updated_at: "2026-07-04T17:51:01.130Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Created the flag-resolution plan"
    next_safe_action: "Reconcile the cross-cutting docs to the final tally"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-20-plan-028-022-kept-off-flag-resolution"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Kept-Off Flag Resolution

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation over a committed code state |
| **Framework** | Spec Kit spec-folder docs, changelogs and decision-records |
| **Storage** | Repository files, git history |
| **Testing** | Strict spec validation, HVR voice scan, cross-doc consistency check |

### Overview
This phase records the final flip-or-delete decision for every 028 default-off flag. The decisions came from a fair real-world simulation that used claude2 and gpt-5.5 as the live signal, then a fresh-Opus final decision gate per flag. The plan documents that method, hardens it with a 4-layer verification and reconciles the four cross-cutting docs, the affected decision-records, the changelog and the timeline to the keep 5 and delete 10 reality. The ten deleted flags had their code removed and committed before this phase.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Every default-off flag is enumerated.
- [x] The criterion-4 benchmark and the real-world simulation have produced their measured signal.
- [x] The code removal of the deleted flags is committed.

### Definition of Done
- [x] Every flag has a final keep-or-delete decision with one-line deciding evidence.
- [x] The four cross-cutting docs, the affected decision-records, the changelog and the timeline agree with the tally.
- [x] Strict validation exits 0 for the 028 root and this child.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A decision reckoning recorded as documentation over an already-committed code state.

### Key Components
- **The per-flag resolution table**: each flag is KEPT default-on or DELETED with measured evidence.
- **The method record**: the real-world simulation signal plus the fresh-Opus per-flag gate.
- **The 4-layer verification**: triage, adversarial-verify, fresh-Opus, deep-review.
- **The documentation reconciliation**: the four cross-cutting docs, the decision-records, the changelog and the timeline.

### Data Flow
Each flag's measured signal feeds the fresh-Opus gate, which decides keep or delete. The decision then propagates into the resolution table, the cross-cutting docs and the affected decision-records so every surface tells the same story.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `../feature-flags.md` | Listed all 37 switches with three flips | Drop the 10 deleted, list the 5 kept | Only the 5 kept flags appear as live |
| `../keep-off-flag-roadmap.md` | Path-to-useful triage | Replace with the keep-or-delete resolution table | Every flag has a final disposition |
| `../benchmark-status.md` | Four-flip transitional tally | Record keep 5 and delete 10 | Final tally present |
| `../before-vs-after.md` | Four-flip narrative | Reconcile to keep 5 and delete 10 | Intro, Section 6 and Current State agree |
| `../**/decision-record.md` | Design-of-record for deleted flags | Add deleted-superseded note | Each deleted flag's record carries the note |
| `../timeline.md` Section G | Four-flip arc | Reconcile to keep 5 and delete 10 | Section G tally matches |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Enumerate every 028 default-off flag and its measured signal.
- [x] Confirm the code removal of the deleted flags is committed.
- [x] Confirm the criterion-4 benchmark and the real-world simulation evidence are available.

### Phase 2: Core Reconciliation
- [x] Reconcile `feature-flags.md` to the 5 kept switches and an at-the-end record of the 10 deleted.
- [x] Replace the `keep-off-flag-roadmap.md` path-to-useful framing with the keep-or-delete resolution table.
- [x] Record the keep 5 and delete 10 tally in `benchmark-status.md`.
- [x] Reconcile `before-vs-after.md` to the final reality.
- [x] Add the deleted-superseded note to each affected decision-record.
- [x] Update the changelog milestone and the timeline Section G.

### Phase 3: Verification
- [x] Confirm every disposition traces to a measured number or a structural fact.
- [x] Run an HVR scan across the reconciled surfaces.
- [x] Run strict validation for the 028 root and this child.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Disposition trace | Per-flag evidence | Read against benchmark-status and the simulation record |
| HVR voice scan | Reconciled docs | Em-dash, semicolon and Oxford-comma scan |
| Cross-doc consistency | The four docs plus the changelog and timeline | Read each surface for the same tally |
| Spec validation | This child and the 028 root | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Committed code removal of the deleted flags | Internal | Green | The docs would describe a state the code has not reached |
| Criterion-4 benchmark and real-world simulation | Internal | Green | No measured signal to decide on |
| Spec-kit validator | Internal | Green | Cannot claim phase validation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A disposition cannot be traced to a measured number, or a deleted flag still reads as live in a doc.
- **Procedure**: Restore the prior doc text for that surface, re-trace the flag to its evidence, then re-apply the corrected disposition.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Reason |
|-------|------------|--------|
| 007 | `../004-review-remediation/spec.md` | The deep-review rounds validated the disposition this phase records |
| 007 | `../benchmark-status.md` | The criterion-4 measurement is the deciding evidence baseline |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| Cross-cutting doc reconciliation | Medium | Four narrative docs to the final tally |
| Decision-record notes | Small | One line per deleted-flag record |
| Changelog and timeline | Medium | One milestone reframe plus Section G |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

- Keep the prior doc text before each reconciliation edit.
- Revert any disposition that cannot trace to a measured number or a structural fact.
- Re-run `validate.sh --strict` on the 028 root after rollback.
<!-- /ANCHOR:enhanced-rollback -->
