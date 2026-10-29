---
title: "Tasks: Phase 12: align-cli-orca"
description: "Ordered tasks for the cli-orca alignment check: scope and first battery, review lanes, critic, fix lane, dispositions, router-prose pass, recheck and the router parse compare."
trigger_phrases:
  - "align cli orca tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 12: align-cli-orca

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
- `S` is `.skilled/skills/cli-orca/`, the skill under check.
- `R` is the run folder outside the checkout, where the check wrote its evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Resolve the files of `S` changed since base `6a9946a800`. Verify: the scope step prints a file count.
  - Evidence: 27 first-parent commits to `4f741f6b48`; 7 files, 0 uncommitted or untracked.
- [x] T002 Run the check battery on the pushed tree. Verify: the battery prints its counts.
  - Evidence: `{"pass":47,"not_applicable":7}`.
- [x] T003 [P] Score the routing probe prompts against the advisor. Verify: the probe run prints its counts.
  - Evidence: `STATUS=OK run-probes: pass=10 fail=0 cannot_run=0`. All 10 probes passed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the four read-only review lanes A to D with DeepSeek V4.1 Flash workers. Verify: each lane writes its findings.
  - Evidence: lanes A, B, C and D ran; 20 findings counted.
- [x] T005 Let the critic overturn weak findings. Verify: the overturned count is recorded.
  - Evidence: 9 findings overturned and not counted.
- [x] T006 Apply the upheld findings that do not change routing in the fix lane (`S`). Verify: each applied item reads FIXED.
  - Evidence: 17 FIXED: C-02, C-01, A-01, A-02, A-03, A-04, A-06, B-06, C-03, C-05, C-06, D-02, D-03, D-04, D-07, D-08, E-02.
- [x] T007 Record a disposition for each LEFT and OUTSIDE item. Verify: each item has a Disposition line.
  - Evidence: 0 LEFT and 3 OUTSIDE items, each with a disposition.
  - OUTSIDE A-05: Routing vocabulary in graph-metadata.json intent_signals; held by the no-routing-change decision, carried to the routing follow-up.
  - OUTSIDE E-01: Fixed in the router-prose pass: ROUTER.md now says 'ambiguous send', the RECOVERY keyword the pseudocode uses.
  - OUTSIDE C-04: Fixed in the router-prose pass: the L0 row now names SKILL.md and this ROUTER.md.
- [x] T008 Fix the router prose the fix lane was barred from (`S/ROUTER.md`). Verify: the disposition names the router-prose pass.
  - Evidence: fixed OUTSIDE E-01 and OUTSIDE C-04.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the fix-lane checks over the changed files. Verify: each check passes.
  - `package_skill.py --check --strict` on the skill: PASS.
  - `validate_document.py` on the 15 changed markdown files: Total issues: 0 on 14. `manual-testing-playbook.md` is VALID with 1 `document_type_fallback` warning that was there before.
  - `check-markdown-links.cjs`: OK, 0 broken markdown links.
  - `validate-playbook-package.cjs`: PASS, tier FAIL_CLOSED, 8 scenarios, 4 categories, 0 violations, 1 warning.
  - `ci-skill-root-metadata.cjs`: OK for cli-orca.
- [x] T010 Rerun the full battery against the worktree. Verify: each failure has a classification.
  - Evidence: `{"pass":57,"not_applicable":7,"fail":2}`.
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
- [x] The recheck battery in `R` reads `{"pass":57,"not_applicable":7,"fail":2}`, with every failure classified.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: `../spec.md`, which records the routing follow-up
<!-- /ANCHOR:cross-refs -->

---
