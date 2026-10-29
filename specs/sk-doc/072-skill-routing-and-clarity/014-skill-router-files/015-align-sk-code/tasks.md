---
title: "Tasks: Phase 15: align-sk-code"
description: "Ordered tasks for the sk-code alignment check: resolve the file set, run the battery, review in four lanes, apply the critic and fix lane, add the drift tests to CI, and recheck."
trigger_phrases:
  - "align sk code tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 15: align-sk-code

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
- `S` is `.skilled/skills/sk-code/`, the skill under check.
- `E` is the run folder outside the checkout, where the evidence file lives.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Resolve the files under `S` changed since base `6a9946a800`. Verify: the evidence lists the commit range and file count.
  - Observed: 27 first-parent commits to `4f741f6b48`, 71 files, 0 uncommitted or untracked.
- [x] T002 Run the check battery on the pushed tree. Verify: the evidence prints the battery counts.
  - Observed: `{"pass":112,"not_applicable":4}`.
- [x] T003 [P] Score the routing probe prompts against the advisor. Verify: the evidence prints the probe result.
  - Observed: `no probes`; sk-code has none to score.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the four read-only review lanes with DeepSeek V4.1 Flash workers. Verify: the evidence lists lanes A to D.
  - Observed: 27 findings (P0 0, P1 3, P2 24), 20 literal, 0 inferred, 14 outside the scope.
- [x] T005 Let the critic overturn weak findings. Verify: the evidence counts the overturned ones.
  - Observed: 2 more were overturned and not counted.
- [x] T006 Apply the upheld findings that do not change routing (`S`). Verify: the evidence lists each FIXED line.
  - Observed: 26 FIXED lines, from the E-01 docstring to D-04; A-05 makes an unreadable ROUTER.md fall back to SKILL.md (fixture 0 findings at HEAD, now 1).
- [x] T007 Add a CI step for the drift checker's suite (`.github/workflows/sk-code-script-tests.yml`). Verify: the suite passes locally.
  - Observed: the step runs `test_verify_alignment_drift.py`; `/usr/bin/python3` prints 36 tests OK.
- [x] T008 Record a disposition for each LEFT and OUTSIDE item. Verify: each has a disposition line.
  - Observed: 1 LEFT (E-01) and 1 OUTSIDE (A-06) item each carry one; see `implementation-summary.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the fix-lane checks over the changed files. Verify: each passes.
  - Observed: `package_skill.py --check --strict` PASS on all five; `validate_document.py` 0 issues on 41 `.md`; links 0 broken.
- [x] T010 Recheck the full battery against the worktree. Verify: each failure is classified.
  - Observed: `{"pass":126,"not_applicable":4,"fail":4}`; S2, S7 and S11 are derived, S3-catalog-package was fixed after the recheck.
- [x] T011 Prove no skill routes differently. Verify: the router-file resolver reads every router the same as HEAD.
  - Observed: all 54 skill routers parse identically to HEAD.
- [x] T012 Fill the spec documents (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`). Verify: `validate.sh --strict` prints `RESULT: PASSED`.
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
- **Parent**: `../spec.md`, which records the routing follow-up
<!-- /ANCHOR:cross-refs -->

---
