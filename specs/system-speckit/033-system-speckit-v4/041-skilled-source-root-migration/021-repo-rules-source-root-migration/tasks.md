---
title: "Tasks: Phase 21: repo-rules-source-root-migration"
description: "Ordered tasks for phase 21, grouped into baseline, research, move, reference rewrite, machine surfaces and verification."
trigger_phrases:
  - "repo rules source migration tasks"
  - "phase 21 tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 21: repo-rules-source-root-migration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create the worktree off HEAD and confirm a clean status (worktrees/056-repo-rules-source-root-migration)
- [x] T002 Record every before-state receipt the phase will re-measure (scratch/baseline)
- [x] T003 Record the frozen-set digest and the base commit (scratch/baseline/freeze-digest.txt)
- [x] T004 Scaffold the packet at Level 2 and correct the phase number and predecessor rows (021-repo-rules-source-root-migration)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Research

- [x] T005 Run the bounded deep-research loop over the reference census (research/) — one `cli-pi` lineage, three iterations; `scratch/research-dispatch.sh` is the run's record
- [x] T006 Reconcile every census row against the cited inventory: confirmed, corrected or added (research/research.md)
- [x] T007 Fold each corrected row into the layout decision and the scope (spec.md, plan.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Move and Farm

- [x] T008 `git mv` the 13 rule files into `.skilled/repo-rules/` as a rename-only commit (`f1b798914e`, 13 × `R100`)
- [x] T009 Create the 13 tracked symlinks and commit the farm with the move
- [x] T010 Confirm `git log --follow` still walks each rule's history
- [x] T011 Fix the divider defect in `answer-the-actual-request.md` — bundled with the farm and the checker instead of a standalone commit, because the backlink rewrite and the layout-aware checker must land together or the checker is transiently red (`6eedc5f930`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Reference Rewrite

- [x] T012 Re-point the 13 rule-body backlinks to `../../REPO%20RULES.md`
- [x] T013 Re-point the 26 router rows in `REPO RULES.md`
- [x] T014 Re-point `AGENTS.md`'s five links to the canonical path (nine link instances across those five lines)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Machine and Consumer Surfaces

- [x] T015 Make `check-repo-rules.cjs` layout-aware and add the farm-integrity check — the checker keeps its nine checks (its verdict delta is the claim); the farm check lives in `scratch/check-farm.cjs`
- [x] T016 Update the sk-create-repo-rule skill, references and playbook
- [x] T017 Update the `/create:repo-rule` command description and assets — the assets resolve the rules directory at setup; the catalog description keeps the public name (a label, mirrored across three catalogs)
- [x] T018 Update the authored agent files and regenerate every mirror (`.skilled` and `.claude` edited together; `.pi`, `.codex` and `.hermes` regenerated)
- [x] T019 Update the CI filters and `GUARD`, and the workflows README row
- [x] T020 Update the sk-communication benchmark generator and refresh its cases — the generator reads `cases.json` rather than writing it, and the frozen case set is condition-agnostic, so there was no case artifact to refresh
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Verification

- [x] T021 Corpus checker 9/9 from the worktree
- [x] T022 Portability fixture: the same verdict with only `repo-rules/` present
- [x] T023 Farm integrity, router and rule-body link integrity, and the mutated fixture that proves the farm check reports a missing entry
- [x] T024 Gate inputs, every mirror `--check`, derived-artifact freshness
- [x] T025 Frozen-set digest unchanged, and the full rescan with a disposition per hit
- [x] T026 Validate the child `--strict` and the parent `--recursive --strict`
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed — `scratch/verify.sh`, receipt in `scratch/verify-run.txt`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P0] Baseline receipts recorded before the first change
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The corpus checker keeps its nine checks and its output format
- [x] CHK-011 [P0] No code comment names a packet, phase or task id — the blocking comment-hygiene gate ran inside every commit
- [x] CHK-012 [P1] Every edited markdown file keeps its frontmatter and anchors
- [x] CHK-013 [P1] No unrelated file appears in any phase commit
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] The corpus checker prints `RESULT: PASSED (9/9 checks)` from the worktree
- [x] CHK-021 [P0] The same checker passes from a fixture that carries only `repo-rules/`
- [x] CHK-022 [P0] Every farm entry resolves, and no extra entry exists
- [x] CHK-023 [P0] Every generated mirror `--check` exits 0 with no NEW drift — the Hermes mirror carries one pre-existing drift at the base (`cli-devin`) and is judged against the base drift set
- [x] CHK-024 [P1] `check-gate-inputs.sh` reports `RESULT: PASSED`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security Checklist

- [x] CHK-030 [P1] No farm symlink points outside the repository root
- [x] CHK-031 [P1] No private home-derived path enters a tracked file
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:deployment -->
## Deployment Checklist

- [x] CHK-040 [P1] The frozen-set digest is unchanged between the base commit and the phase head (the one activation manifest the commit gate re-minted is asserted separately)
- [x] CHK-041 [P1] The branch is pushed from the worktree and integration is left to the operator — no PR was requested
<!-- /ANCHOR:deployment -->

---

<!-- ANCHOR:acceptance -->
## Acceptance

- [x] CHK-050 [P0] Every row of acceptance-criteria.md carries evidence
- [x] CHK-051 [P0] `validate.sh --strict` passes for the child and the parent
<!-- /ANCHOR:acceptance -->

---
