---
title: "Feature Specification: Phase 3: repin"
description: "Moving a vendored Skilled copy to a new upstream commit is a manual runbook with scratch scripts, no backup of the untracked tree and no check for in-place edits the copy will revert. This phase adds the /doctor:overlay repin target, which stages, scans for unowned drift, backs up, copies, applies, checks and rolls back in one guarded run."
trigger_phrases:
  - "overlay repin"
  - "phase 3 repin"
  - "doctor overlay repin rollback"
  - "repin stage report"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.4 -->
# Feature Specification: Phase 3: repin

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

A vendored Skilled copy is moved to a new pin by a seven-step runbook, and its tree is untracked, so nothing can undo a bad copy and an in-place fix is silently reverted. This phase adds `/doctor:overlay repin`, which refuses on unowned drift, backs up every path it will touch before the first write, and restores them with `--rollback <run>`. `--stage <dir>` runs the same steps on a copy and reports blocked overlays and overlays that now equal upstream, leaving the live tree byte-identical.

**Key Decisions**: back up only the paths the copy will touch; copy changed `.skilled` paths and whole runtime folders, minus a manifest exclude list.

**Critical Dependencies**: a local Skilled checkout holding both the old and the new commit, passed as `--upstream <dir>`.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-06 |
| **Branch** | `worktrees/320-system-skilled-doctor` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 4 |
| **Predecessor** | 002-overlay-engine |
| **Successor** | 004-guard-hook |
| **Handoff Criteria** | `repin`, `--stage` and `--rollback` pass their failing-first tests and route through `/doctor:overlay repin` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Build system-skilled-doctor and the doctor overlay command specification.

**Scope Boundary**: the `repin` code in the engine, its tests, its workflow and its route, and the re-pin steps in the skill's overlay reference.

**Dependencies**:
- Phase 002's engine, its lock and its `apply` and `status`.

**Deliverables**:
- `overlay-engine.cjs repin`, `--stage <dir>` and `--rollback <run>`.
- `doctor-overlay-repin.yaml` and the `repin` route.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Barter's tree is untracked, so a re-pin overwrites files nothing can restore, and the runbook's "restore from git" rollback does not exist. Edits made in place in the vendored tree are reverted by the next copy: four routers and the template came back with the old sentence after re-pin 034. Each re-pin hand-builds a dry tree and hand-inventories dead overlay entries.

### Purpose
A maintainer re-pins with one staged run, rebases what the stage report lists, then one live run that either finishes clean or can be rolled back byte for byte.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
From `../research/research.md` and the re-pin 034 facts it cites:

```text
$ git ls-files skilled | wc -l        # run from the ai-speckit root
0
034 facts.md:20-22: 36 routers edited in Skilled, 32 equal to Barter's in-place edits,
4 routers and the template reverted by the re-pin
034 facts.md:29-30: a 141-line integrate.sh built dry/ and int/ trees and 45 dead entries were dropped by hand
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `repin --upstream <dir> --to <commit>` to the engine, holding its lock from the copy to the first clean apply.
- Refuse while an unowned file in the copied roots differs from the old pin, naming the path.
- Back up every path the copy will overwrite or delete before the first write, and restore them with `--rollback <run>`.
- Add `--stage <dir>`, which runs the same steps on a copy and reports blocked overlays and overlays that now equal upstream.
- Add the `repin` workflow and route.

### Out of Scope
- Automatic rebase of blocked overlays - the 034 rebases needed judgment, so the report lists them for a person.
- A full-tree backup tar - the touched paths are known before the first write.
- Automatic stale-lock clearing - no Barter run left a stale lock.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modify | The `repin` target |
| `.skilled/commands/doctor/scripts/tests/overlay-engine*.test.cjs` | Modify, Create | One failing-first test per requirement |
| `.skilled/commands/doctor/assets/doctor-overlay-repin.yaml` | Create | The workflow |
| `.skilled/commands/doctor/{overlay.md,_routes.yaml}`, `assets/doctor-overlay-presentation.txt` | Modify | The `repin` route and its wording |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modify | The re-pin steps and the rollback |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids follow the design packet's numbering.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-006 | `repin` backs up every path it will overwrite or delete before its first write |
| REQ-007 | `repin` refuses while any unowned file in the copied roots differs from the old pin |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-010 | `repin --stage <dir>` builds the re-pinned tree in a copy and reports blocked overlays and overlays that now equal upstream |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `repin --rollback <run>` restores the backed-up bytes and the tree passes `status` again.
- **SC-002**: after `repin --stage <dir>`, a hash of every live file equals its hash before the run.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | A local Skilled checkout with both commits | `repin` cannot stage or scan without it | `repin` refuses when either commit is missing there |
| Risk | A failure after the first write leaves a half-moved tree | High | The backup is complete before the first write, and every failure names the run folder for `--rollback` |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The backup holds only the paths the copy touches, not the whole tree.

### Security
- **NFR-S01**: `repin` never copies over a path in the manifest's `repin.exclude` list.

### Reliability
- **NFR-R01**: `--rollback <run>` is byte-exact: every restored file's hash equals its recorded hash.

---

## 8. EDGE CASES

- Empty input: a re-pin to the commit already pinned reports nothing to copy and writes nothing.
- Maximum input: a re-pin over Barter's tree, with 116 overlays and whole runtime folders.
- Failure path: a missing commit in `--upstream` exits non-zero before any write.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: about 6, LOC: about 600, Systems: the engine and git |
| Risk | 18/25 | Auth: N, API: N, Breaking: writes an untracked tree |
| Research | 5/20 | Done in the design packet |
| Multi-Agent | 3/15 | Workstreams: 1 |
| Coordination | 6/15 | Dependencies: phase 002's engine and lock |
| **Total** | **46/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The backup misses a path the copy touches | H | L | The backup list and the copy list come from one computed set, and a test compares them |
| R-002 | `--stage` writes to the live tree | H | L | A test hashes the live tree before and after |

---

## 11. USER STORIES

### US-001: Undo a bad re-pin (Priority: P0)

**As a** maintainer of a vendored Skilled copy, **I want** to roll a re-pin back byte for byte, **so that** a bad copy over an untracked tree is not permanent.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: See what a re-pin would block before it runs (Priority: P1)

**As a** maintainer, **I want** a staged run that lists blocked and dead overlays, **so that** I rebase them before touching the live tree.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None. The copy split and the exclude list are the operator's "keep both" ruling.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decisions**: See `decision-record.md`

---
