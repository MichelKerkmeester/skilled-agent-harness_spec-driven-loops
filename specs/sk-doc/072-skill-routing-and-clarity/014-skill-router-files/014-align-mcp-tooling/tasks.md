---
title: "Tasks: Phase 14: align-mcp-tooling"
description: "Ordered tasks for the mcp-tooling alignment check: resolve the file set, run the battery and probes, review in four lanes, apply the critic and fix lane, fix the router prose, and recheck."
trigger_phrases:
  - "align mcp tooling tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 14: align-mcp-tooling

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
- `S` is `.skilled/skills/mcp-tooling/`, the skill under check.
- `E` is the run folder outside the checkout, where the evidence file lives.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Resolve the files under `S` changed since base `6a9946a800`. Verify: the evidence lists the commit range and file count.
  - Observed: 27 first-parent commits to `4f741f6b48`, 96 files, 0 uncommitted or untracked.
- [x] T002 Run the check battery on the pushed tree. Verify: the evidence prints the battery counts.
  - Observed: `{"pass":153,"not_applicable":3}`.
- [x] T003 [P] Score the routing probe prompts against the advisor. Verify: the evidence prints the probe counts.
  - Observed: `pass=10 fail=3 cannot_run=0`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the four read-only review lanes with DeepSeek V4.1 Flash workers. Verify: the evidence lists lanes A to D.
  - Observed: 27 findings (P0 0, P1 4, P2 23), 9 literal, 0 inferred, 17 outside the scope.
- [x] T005 Let the critic overturn weak findings. Verify: the evidence counts the overturned ones.
  - Observed: 17 more were overturned and not counted.
- [x] T006 Apply the upheld findings that do not change routing (`S`). Verify: the evidence lists each FIXED line.
  - Observed: 17 FIXED lines, from A-01 to D-07 plus the step-4 changelog bullets; C-02 closed with the A-08 edit.
- [x] T007 Fix the router prose the fix lane was barred from (`S/mcp-click-up/ROUTER.md`, `S/mcp-notion/ROUTER.md`). Verify: the ALWAYS line names SKILL.md and this ROUTER.md.
  - Observed: A-03 and A-04 are fixed in the router-prose pass.
- [x] T008 Record a disposition for each LEFT and OUTSIDE item. Verify: each has a disposition line.
  - Observed: 3 LEFT and 5 OUTSIDE items each carry one; see `implementation-summary.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the fix-lane checks over the changed files. Verify: each passes.
  - Observed: `package_skill.py --check --strict` PASS (hub and 8 packets); `validate_document.py` 0 issues on 62 files; links 0 broken.
- [x] T010 Recheck the full battery against the worktree. Verify: each failure is classified.
  - Observed: `{"fail":3,"pass":202,"not_applicable":3}`; S2-skill-package, S7-compiled-route-guard and S11-hermes-skills are all derived.
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
