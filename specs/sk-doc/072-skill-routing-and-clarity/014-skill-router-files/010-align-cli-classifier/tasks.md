---
title: "Tasks: Phase 10: align-cli-classifier"
description: "Ordered tasks for the cli-classifier alignment check: scope and first battery, review lanes, critic, fix lane, dispositions, router-prose pass, recheck and the router parse compare."
trigger_phrases:
  - "align cli classifier tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 10: align-cli-classifier

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
- `S` is `.skilled/skills/cli-classifier/`, the skill under check.
- `R` is the run folder outside the checkout, where the check wrote its evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Resolve the files of `S` changed since base `6a9946a800`. Verify: the scope step prints a file count.
  - Evidence: 27 first-parent commits to `4f741f6b48`; 9 files, 0 uncommitted or untracked.
- [x] T002 Run the check battery on the pushed tree. Verify: the battery prints its counts.
  - Evidence: `{"pass":52,"not_applicable":3}`.
- [x] T003 [P] Score the routing probe prompts against the advisor. Verify: the probe run prints its counts.
  - Evidence: `STATUS=FINDINGS run-probes: pass=13 fail=1 cannot_run=0`. 13 of 14 probes passed and 1 failed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the four read-only review lanes A to D with DeepSeek V4.1 Flash workers. Verify: each lane writes its findings.
  - Evidence: lanes A, B, C and D ran; 15 findings counted.
- [x] T005 Let the critic overturn weak findings. Verify: the overturned count is recorded.
  - Evidence: 11 findings overturned and not counted.
- [x] T006 Apply the upheld findings that do not change routing in the fix lane (`S`). Verify: each applied item reads FIXED.
  - Evidence: 11 FIXED: A-01, A-02, A-04, B-02, B-03, B-05, C-06, D-01, D-03, F-01, F-02.
- [x] T007 Record a disposition for each LEFT and OUTSIDE item. Verify: each item has a Disposition line.
  - Evidence: 1 LEFT and 1 OUTSIDE items, each with a disposition.
  - LEFT A-03: Fixed in the router-prose pass: the sentence now says SKILL.md keeps a short routing summary and a pointer, in five hubs and the sk-design hub.
  - OUTSIDE D-05: Routing vocabulary in graph-metadata.json intent_signals; held by the no-routing-change decision for this packet, carried to the routing follow-up.
- [x] T008 Fix the router prose the fix lane was barred from (`S/ROUTER.md`). Verify: the disposition names the router-prose pass.
  - Evidence: fixed LEFT A-03.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the fix-lane checks over the changed files. Verify: each check passes.
  - `package_skill.py --check --strict` on the hub: PASS.
  - `package_skill.py --check --strict` on `cli-jev`: PASS.
  - `validate_document.py` on each of the 12 changed markdown files: Total issues: 0.
  - `check-markdown-links.cjs`: OK, 0 broken markdown links.
- [x] T010 Rerun the full battery against the worktree. Verify: each failure has a classification.
  - Evidence: `{"fail":3,"pass":56,"not_applicable":3}`.
  - S2-skill-package: derived: the compiled policy hash in the hub manifest re-mints at commit.
  - S7-compiled-route-guard: derived: the activation manifests re-mint at commit, by the pre-commit compiled-routing gate.
  - S11-hermes-skills: derived: the Hermes skill copies regenerate from source before the commit.
- [x] T011 Compare every skill router with HEAD through the router-file resolver. Verify: all routers parse identically.
  - Evidence: all 54 skill routers parse identically to HEAD, so no skill routes differently.
- [x] T012 Fill this phase's documents (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`). Verify: `validate.sh --strict` prints `RESULT: PASSED`.
  - Evidence: `validate.sh --strict` on this folder printed `RESULT: PASSED` with 0 warnings.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The recheck battery in `R` reads `{"fail":3,"pass":56,"not_applicable":3}`, with every failure classified.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: `../spec.md`, which records the routing follow-up
<!-- /ANCHOR:cross-refs -->

---
