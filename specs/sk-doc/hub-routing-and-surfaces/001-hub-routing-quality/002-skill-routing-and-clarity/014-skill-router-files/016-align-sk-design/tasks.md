---
title: "Tasks: Phase 16: align-sk-design"
description: "Ordered tasks for the sk-design alignment check: resolve the file set, run the battery and probes, review in four lanes, apply the critic and fix lane, fix the router prose and catalog description, and recheck."
trigger_phrases:
  - "align sk design tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 16: align-sk-design

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Shell variables used below:
- `S` is `.skilled/skills/sk-design/`, the skill under check.
- `E` is the run folder outside the checkout, where the evidence file lives.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Resolve the files under `S` changed since base `6a9946a800`. Verify: the evidence lists the commit range and file count.
  - Observed: 27 first-parent commits to `4f741f6b48`, 39 files, 0 uncommitted or untracked.
- [x] T002 Run the check battery on the pushed tree. Verify: the evidence prints the battery counts.
  - Observed: `{"pass":87,"fail":1,"not_applicable":3}`; the one fail is BAT-01, `router-pseudocode.md`.
- [x] T003 [P] Score the routing probe prompts against the advisor. Verify: the evidence prints the probe counts.
  - Observed: `pass=0 fail=0 cannot_run=11`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the four read-only review lanes with DeepSeek V4.1 Flash workers. Verify: the evidence lists lanes A to D.
  - Observed: 46 findings (P0 0, P1 9, P2 37), 35 literal, 4 inferred, 16 outside the scope.
- [x] T005 Let the critic overturn weak findings. Verify: the evidence counts the overturned ones.
  - Observed: 12 more were overturned and not counted.
- [x] T006 Apply the upheld findings that do not change routing (`S`). Verify: the evidence lists each FIXED line.
  - Observed: 38 FIXED lines; B-001 and BAT-01 share one edit, and `router-pseudocode.md` now validates VALID with 0 issues.
- [x] T007 Fix the router prose the fix lane was barred from (`S/ROUTER.md` and three packet `ROUTER.md` files). Verify: each OUTSIDE prose item reads fixed.
  - Observed: A-03, B-006, D-02, E-01 and E-02 are fixed in the router-prose pass.
- [x] T008 Give the sk-design-diagram catalog leaf and the root catalog one description (`S/sk-design-diagram/feature-catalog/diagram-generation/type-selection-and-routing.md`). Verify: `validate_catalog_package.py` reports 0 fail.
  - Observed: both share one description; `validate_catalog_package.py` reports 0 fail.
- [x] T009 Record a disposition for each OUTSIDE item. Verify: each has a disposition line.
  - Observed: all 7 OUTSIDE items carry one; there are 0 LEFT items. See `implementation-summary.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the fix-lane checks over the changed files. Verify: each passes or matches the HEAD baseline.
  - Observed: `package_skill.py --check --strict` PASS on all five; `validate_document.py` 45 VALID of 49, 4 INVALID unchanged from HEAD; links 0 broken.
- [x] T011 Recheck the full battery against the worktree. Verify: each failure is classified.
  - Observed: `{"fail":7,"pass":111,"not_applicable":3}`; S2-skill-package, S7 and S11 are derived, and the four S2-validate-document fails are pre-existing.
- [x] T012 Prove no skill routes differently. Verify: the router-file resolver reads every router the same as HEAD.
  - Observed: all 54 skill routers parse identically to HEAD.
- [x] T013 Fill the spec documents (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`). Verify: `validate.sh --strict` prints `RESULT: PASSED`.
  - Observed: `validate.sh --strict` on this folder printed `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The evidence file in `E` holds the output behind every count in this folder.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: `../spec.md`, which records the routing follow-up and where the reference-format debt is fixed
<!-- /ANCHOR:cross-refs -->

---
