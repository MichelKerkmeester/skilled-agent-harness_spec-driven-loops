---
title: "Feature Specification: Phase 8: push Skilled main with every overlay fix and re-pin Barter onto it"
description: "Phase 006's engine fixes sit on local Skilled main, which has diverged from origin, and Barter's vendored tree still runs the earlier pin. This phase merges origin into main, pushes main with every fix after the gates pass, and records the pushed commit so a later ai-speckit session can re-pin Barter onto it and re-run Barter's gates."
trigger_phrases:
  - "push and repin"
  - "phase 8 push and repin"
  - "push skilled main with the overlay fixes"
  - "repin barter onto the pushed skilled commit"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: push Skilled main with every overlay fix and re-pin Barter onto it

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-20 |
| **Branch** | `main` in Skilled, then `skilled/v4.1.0.0` in ai-speckit |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-barter-review-fixes |
| **Successor** | None |
| **Handoff Criteria** | `git rev-parse origin/main` in Skilled contains the Target Skilled commit below, and ai-speckit's `overlays/overlay-manifest.json` pins that commit with every Barter gate green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the overlay framework/root layout packet. It runs in two sessions. A Skilled session merges origin into main, runs the gates and pushes. A later ai-speckit session, with cwd `/Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit`, re-pins onto the pushed commit and re-runs Barter's gates.

Target Skilled commit: b5a630c6efaf30d36bb18e2bae875b03ab8f4600

The line above holds the 40-hex id of the main HEAD the Skilled session pushed with its gates green. That commit carries every Skilled fix. The docs-only commit that records the id follows it on main. The re-pin targets the id on this line, not whatever main is later.

**Scope Boundary**: The Skilled session writes main's merge and push, and this folder. The ai-speckit session writes ai-speckit and, in Skilled, only this folder's tasks and summary.

**Dependencies**:
- Phase 006's engine fixes, merged on local main (`468f1bb4762`).
- Phase 007's ai-speckit fix commit `5dd004f3faa`, which the re-pin keeps.
- The operator's go-ahead to fetch and push Skilled main, given 2026-11-20.

**Deliverables**:
- Skilled `origin/main` holding every fix, with the gates green on the merged main.
- The pushed id on the Target Skilled commit line.
- Barter re-pinned onto that id, with its gates green (the ai-speckit session).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 006's engine fixes, the relayout rollback and the outside-repository refusal among them, exist only on local Skilled main, which is 10 commits ahead of and 34 behind `origin/main`. Barter's vendored tree runs pin `063daaee`, so it carries none of them, and phase 007's hook fixes are a local ai-speckit commit.

### Purpose
Skilled `origin/main` carries every fix, and Barter runs the engine from that exact commit with its hooks, checks and tests green.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
On local main at `0557b1b8b43`, before the merge with origin:
```text
$ git rev-list --left-right --count main...origin/main
10	34
$ node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs
ℹ tests 262 ℹ pass 262 ℹ fail 0        (exit 0)
$ node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs
ℹ tests 20 ℹ pass 20 ℹ fail 0          (exit 0)
$ node --test .skilled/commands/doctor/scripts/tests/doctor-overlay-contract.test.cjs
ℹ tests 9 ℹ pass 9 ℹ fail 0            (exit 0)
$ bash .skilled/commands/doctor/scripts/route-validate.sh
OK: route-validate — 32 routes validated, 11 warnings   (exit 0)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Merge `origin/main` into local main with a merge commit, never a rebase, because local main carries merge commits.
- Run the engine suite, the guard suite, the presentation contract test, `route-validate` and the packet's recursive strict validation on the merged main.
- Push main to origin without force or `--no-verify`, and record the pushed id on the Target Skilled commit line.
- Re-pin ai-speckit onto that id and re-run Barter's gates (the ai-speckit session).

### Out of Scope
- Resolving a merge conflict in a file outside this packet's change set - the session stops and reports instead of guessing.
- Files on main that belong to the operator or concurrent sessions - they are never staged, stashed, reset or cleaned.
- Any change to engine code - phase 006 owns the fixes, and this phase only ships them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Skilled `main` | Merge, push | The merge commit with `origin/main`, then the push |
| `008-push-and-repin/spec.md`, `tasks.md`, `implementation-summary.md`, `goal.md` | Modify | The pushed id and the evidence |
| ai-speckit `overlays/overlay-manifest.json`, `overlays/sync-state.json`, `skilled/**` | Modify | The re-pin onto the pushed id (ai-speckit session) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Main is pushed only with its gates green on the merged tree | On the merged main, the engine suite, the guard suite and the contract test each print `fail 0` and exit 0, and `route-validate` exits 0 |
| REQ-002 | `origin/main` carries the Target Skilled commit | `git merge-base --is-ancestor <Target Skilled commit> origin/main` exits 0 |
| REQ-003 | Barter is pinned to the Target Skilled commit | In ai-speckit, `node -p "require('./overlays/overlay-manifest.json').pin.commit"` prints the id on the Target Skilled commit line |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Barter's gates pass after the re-pin | In `skilled/`, `overlay-engine.cjs status --audit` prints `RESULT: PASSED` with `offLayout=[]`; both `overlays/checks` print `RESULT: PASSED`; `pre-commit.test.cjs` passes 6 of 6; `bash tests/run-all.sh` exits 0 |
| REQ-005 | Phase 007's hook fixes survive the re-pin | `git -C <ai-speckit> merge-base --is-ancestor 5dd004f3faa HEAD` exits 0 and `status --audit` reports no drift on the three hooks |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After the push, `git rev-parse origin/main` equals `git rev-parse main` in Skilled.
- **SC-002**: The Target Skilled commit line holds a 40-hex id, and `git merge-base --is-ancestor` with that id and `origin/main` exits 0.
- **SC-003**: In ai-speckit, the manifest's `pin.commit` equals that id and `bash tests/run-all.sh` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Origin moves again between the merge and the push | The push is rejected | Fetch, merge, re-run the gates and push again, at most three attempts |
| Risk | The merge touches a file another session has dirty, or conflicts outside this packet | High | Predict with `git merge-tree` first, and stop and report the files instead of resolving them |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator authorized the fetch and the push of Skilled main on 2026-11-20. The push of ai-speckit is the re-pin session's to ask.
<!-- /ANCHOR:questions -->

---
