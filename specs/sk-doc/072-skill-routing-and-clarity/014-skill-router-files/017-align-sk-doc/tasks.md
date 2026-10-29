---
title: "Tasks: Phase 17: align-sk-doc"
description: "Ordered tasks for the sk-doc alignment check: resolve the file set, run the battery and probes, review in four lanes, apply the critic and fix lane, fix the router prose, add the skill_router type and env rows, and recheck."
trigger_phrases:
  - "align sk doc tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 17: align-sk-doc

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
- `S` is `.skilled/skills/sk-doc/`, the skill under check.
- `E` is the run folder outside the checkout, where the evidence file lives.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Resolve the files under `S` changed since base `6a9946a800`. Verify: the evidence lists the commit range and file count.
  - Observed: 27 first-parent commits to `4f741f6b48`, 100 files, 0 uncommitted or untracked.
- [x] T002 Run the check battery on the pushed tree. Verify: the evidence prints the battery counts.
  - Observed: `{"pass":156,"not_applicable":4,"fail":1}`.
- [x] T003 [P] Score the routing probe prompts against the advisor. Verify: the evidence prints the probe counts.
  - Observed: `pass=17 fail=1 cannot_run=0`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the four read-only review lanes with DeepSeek V4.1 Flash workers. Verify: the evidence lists lanes A to D.
  - Observed: 24 findings (P0 0, P1 3, P2 21), 5 literal, 0 inferred, 13 outside the scope.
- [x] T005 Let the critic overturn weak findings. Verify: the evidence counts the overturned ones.
  - Observed: 11 more were overturned and not counted.
- [x] T006 Apply the upheld findings that do not change routing (`S`). Verify: the evidence lists each FIXED line.
  - Observed: 23 FIXED lines, from S2-1 to D-08.
- [x] T007 Fix the router prose the fix lane was barred from (`.skilled/skills/sk-design/sk-design-chart/ROUTER.md`, `.skilled/skills/sk-design/sk-design-diagram/ROUTER.md`). Verify: neither description claims a projection it does not carry.
  - Observed: A-04 (OUTSIDE) is fixed in the router-prose pass.
- [x] T008 Add a `skill_router` document type for a file named `ROUTER.md` (`S/scripts/validate_document.py`, `S/shared/assets/template-rules.json`, `S/scripts/tests/test_validator.py`). Verify: `test_validator.py` prints `SUMMARY: 15/15 tests passed`.
  - Observed: rules and two tests added; `SUMMARY: 15/15 tests passed`.
- [x] T009 List the routing-shape overrides (`.env.example`). Verify: `rg -n ROUTING_SHAPE .env.example` prints two lines.
  - Observed: `ROUTING_SHAPE_DEBT_FILE` and `ROUTING_SHAPE_SKILLS_ROOT` are listed; ENV-01 (OUTSIDE) is fixed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the fix-lane checks over the changed files. Verify: each passes.
  - Observed: `package_skill.py --check --strict` PASS on the hub and nine packets; `validate_document.py` 0 issues on 54 files; links 0 broken.
- [x] T011 Recheck the full battery against the worktree. Verify: each failure is classified.
  - Observed: `{"pass":190,"not_applicable":4,"fail":6}`; three derived, one by design, one fixed after the recheck, one tool artifact.
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
- **Parent**: `../spec.md`, which records the routing follow-up
<!-- /ANCHOR:cross-refs -->

---
