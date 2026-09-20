---
title: "Tasks: Refresh the eight cli runtime READMEs and their folder maps"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Refresh the eight cli runtime READMEs and their folder maps

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create the numbered worktree off `skilled/v4.0.0.0` (`.worktrees/057-cli-runtime-readme-refresh`)
- [x] T002 Capture the before receipts into `scratch/baseline/` (validator, link checker, folder coverage, hermes sync, pin-path count, derived counts)
- [x] T003 Scaffold the Level 1 packet and assert it landed as `075-cli-runtime-readme-refresh` (`specs/cli-external-orchestration/075-cli-runtime-readme-refresh/`)
- [x] T004 Author `spec.md`, `plan.md` and `tasks.md` with the measured findings and the edit contract
- [x] T005 [P] Emit the eight dispatch prompts (`scratch/build-prompts.cjs` → `scratch/prompts/<runtime>.md`)
- [x] T006 [P] Write the dispatcher against the runtime's exported builder and runner (`scratch/dispatch-readmes.cjs`)
- [x] T007 Dry-run the dispatcher and confirm the constructed argv carries `-p`, `--offline` and a provider-qualified `--model`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T008 [P] Rewrite `cli-claude-code/README.md` (`STRUCTURE` added, renumbered)
- [x] T009 [P] Rewrite `cli-codex/README.md` (`STRUCTURE` added, renumbered)
- [x] T010 [P] Rewrite `cli-cursor/README.md` (`STRUCTURE` added, renumbered)
- [x] T011 [P] Rewrite `cli-devin/README.md` (`STRUCTURE` added, renumbered)
- [x] T012 [P] Extend `cli-hermes/README.md` tree with `feature-catalog/`
- [x] T013 [P] Retitle `cli-jev/README.md` section 1 to `OVERVIEW` and extend its `LAYOUT` tree
- [x] T014 [P] Rewrite `cli-opencode/README.md` (`STRUCTURE` added; name `context-budget.md`, `permissions-matrix.md`)
- [x] T015 [P] Rewrite `cli-pi/README.md` (`STRUCTURE` added; name `providers-and-models.md`)
- [x] T016 Audit `git status --porcelain` after each dispatch batch and revert any write outside a child's one README — audited after every batch; no stray write occurred, so nothing needed reverting
- [x] T017 Repoint the cli-pi contract pin across the 9 files holding it as a link (one substring; relative depth unchanged)
- [x] T018 Regenerate `.hermes/skills/cli-pi/SKILL.md` and restore every unrelated drifted mirror
- [x] T019 Hand-repair whatever the children leave behind (validator errors, unnamed files, numbering gaps) — audited all eight READMEs against the contract; the children left nothing to repair
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 [P] Run `validate_document.py` on all eight READMEs: expect 8/8 `VALID` (before: 7/8)
- [x] T021 [P] Run `check-markdown-links.cjs`: expect 15 broken before, 5 after, none naming the cli-pi cluster or the eight READMEs
- [x] T022 Write and run `scratch/verify.sh`, capturing `scratch/verify-run.txt` with its exit status
- [x] T023 Run `validate.sh --strict` on the packet and require the literal `RESULT: PASSED`
- [x] T024 Audit `git status --porcelain` in the worktree against the authorized path list
- [x] T025 Record the advisory derived-count and reference-check findings, each classified
- [x] T026 Commit in reviewable units, naming paths at commit time
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
