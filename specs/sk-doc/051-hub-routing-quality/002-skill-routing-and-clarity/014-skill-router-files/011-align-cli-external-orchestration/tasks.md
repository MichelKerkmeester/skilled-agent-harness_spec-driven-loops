---
title: "Tasks: Phase 11: align-cli-external-orchestration"
description: "Ordered tasks for the cli-external-orchestration alignment check: scope and first battery, review lanes, critic, fix lane, dispositions, router-prose pass, recheck and the router parse compare."
trigger_phrases:
  - "align cli external orchestration tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 11: align-cli-external-orchestration

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
- `S` is `.skilled/skills/cli-external-orchestration/`, the skill under check.
- `R` is the run folder outside the checkout, where the check wrote its evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Resolve the files of `S` changed since base `6a9946a800`. Verify: the scope step prints a file count.
  - Evidence: 27 first-parent commits to `4f741f6b48`; 73 files, 0 uncommitted or untracked.
- [x] T002 Run the check battery on the pushed tree. Verify: the battery prints its counts.
  - Evidence: `{"pass":128,"not_applicable":3}`.
- [x] T003 [P] Score the routing probe prompts against the advisor. Verify: the probe run prints its counts.
  - Evidence: `no probes`. The check scored no probes for this skill.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the four read-only review lanes A to D with DeepSeek V4.1 Flash workers. Verify: each lane writes its findings.
  - Evidence: lanes A, B, C and D ran; 19 findings counted.
- [x] T005 Let the critic overturn weak findings. Verify: the overturned count is recorded.
  - Evidence: 17 findings overturned and not counted.
- [x] T006 Apply the upheld findings that do not change routing in the fix lane (`S`). Verify: each applied item reads FIXED.
  - Evidence: 19 FIXED: A-01, A-03, A-04, A-05, A-06, A-07, A-08, A-09, B-01, B-02, B-06, B-07, B-09, C-03, C-06, C-09, D-02, D-05, F-01.
- [x] T007 Record a disposition for each LEFT and OUTSIDE item. Verify: each item has a Disposition line.
  - Evidence: the fix-lane results list no LEFT or OUTSIDE item.
- [x] T008 Fix the router prose the fix lane was barred from (`S/ROUTER.md`). Verify: the disposition names the router-prose pass.
  - Evidence: no item for this skill names the router-prose pass in its disposition.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the fix-lane checks over the changed files. Verify: each check passes.
  - `package_skill.py --check --strict` on the hub and its 7 packets: PASS.
  - `validate_document.py` on the 55 changed markdown files: Total issues: 0. It flagged a missing OVERVIEW in the cli-pi `prompt-quality-card.md`, which was there before. Section 1 OVERVIEW was added and the rest renumbered.
  - `check-markdown-links.cjs`: OK, 0 broken markdown links.
- [x] T010 Rerun the full battery against the worktree. Verify: each failure has a classification.
  - Evidence: `{"fail":4,"pass":142,"not_applicable":3}`.
  - S2-skill-package: derived: the compiled policy hash in the hub manifest re-mints at commit.
  - S3-catalog-package: fixed after this recheck: the sk-design-diagram catalog leaf and root now share one description, and validate_catalog_package.py reports 0 fail.
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
- [x] The recheck battery in `R` reads `{"fail":4,"pass":142,"not_applicable":3}`, with every failure classified.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: `../spec.md`, which records the routing follow-up
<!-- /ANCHOR:cross-refs -->

---
