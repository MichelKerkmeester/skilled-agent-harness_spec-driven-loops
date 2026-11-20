---
title: "Implementation Plan: Phase 8: push Skilled main with every overlay fix and re-pin Barter onto it"
description: "Merge origin into local Skilled main, run the doctor gates on the merged tree, push, and record the pushed id; then a later ai-speckit session re-pins Barter onto that id with /doctor:overlay repin and re-runs Barter's gates."
trigger_phrases:
  - "push and repin plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 8: push Skilled main with every overlay fix and re-pin Barter onto it

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | git; Node for the gates |
| **Framework** | The Skilled doctor overlay engine and its `/doctor:overlay repin` workflow |
| **Storage** | None |
| **Testing** | `node --test`, `route-validate.sh`, `validate.sh --strict --recursive`; Barter's checks and `tests/run-all.sh` |

### Overview
The Skilled session brings `origin/main` into local main with a merge commit, proves the merged tree with the doctor gates and pushes it. The pushed id goes on the spec's Target Skilled commit line. The ai-speckit session re-pins onto that id through the engine's own re-pin workflow and proves it with the gates phase 007 used.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phases 006 and 007 complete
- [x] Baseline gates recorded on local main before the merge
- [x] The operator's go-ahead to push Skilled main

### Definition of Done
- [x] All acceptance criteria met
- [x] `git rev-parse origin/main` equals `git rev-parse main`, and ai-speckit's `pin.commit` equals the Target Skilled commit line
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Merge, gate, push, re-pin.

### Key Components
- **Skilled `main`**: receives the merge with `origin/main` and is pushed.
- **ai-speckit's vendored tree `skilled/`**: re-pinned onto the pushed id.

### Data Flow
Local main and `origin/main` meet in one merge commit. The pushed id flows to the Target Skilled commit line, and from there into ai-speckit's `overlays/overlay-manifest.json` `pin.commit`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the baseline gates and predicts the merge with `git merge-tree`. Implementation merges origin, gates the merged tree, pushes and records the id, then the ai-speckit session re-pins. Verification compares `origin/main` with main and re-runs Barter's gates after the re-pin. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

On the merged Skilled main: the engine suite, the guard suite and the contract test print `fail 0` with exit 0, `route-validate` exits 0, and `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED`. A test count other than 262, 20 or 9 is reported as a delta from origin's changes, not a failure, as long as `fail 0` holds. After the re-pin: `status --audit`, both checks, the overlay tests and `tests/run-all.sh`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

git with access to the Skilled origin, and Node. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Before the push, `git reset --keep ORIG_HEAD` undoes the merge on local main if the gates fail. After the push, a bad merge is undone with `git revert -m 1 <merge>` and a new push, never a force-push. A bad re-pin is undone in ai-speckit with `git revert` of the re-pin commit.
<!-- /ANCHOR:rollback -->

---
