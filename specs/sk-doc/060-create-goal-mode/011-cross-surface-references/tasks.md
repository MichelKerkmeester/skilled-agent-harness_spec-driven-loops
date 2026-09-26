---
title: "Tasks: Phase 11: cross-surface-references"
description: "Tasks to name the create-goal mode in every list of sibling create modes, regenerate the advisor command bridges and update the two pinned command counts."
trigger_phrases:
  - "create-goal references tasks"
  - "command bridge tasks"
  - "create asset roster tasks"
  - "phase 011 checklist"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 11: cross-surface-references

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

- [x] T001 Search for documents that name a sibling create mode or command but not the goal mode. Evidence: `rg` over `.skilled`, the runtime folders and the root, outside specs and changelogs, found the root README, the sk-doc README, the `@markdown` agent and its copies, two sk-doc feature-catalog files and the advisor command bridges.
- [x] T002 Check the changelog hub. Evidence: `.skilled/changelog/sk-doc/create-goal` is a committed symlink to `../../skills/sk-doc/sk-create-goal/changelog` and lists `v1.0.0.0.md` and `v1.1.0.0.md`, so no change was needed.
- [x] T003 Compare the command's files with its siblings. Evidence: the router, the auto, confirm and presentation assets, and the copies for Claude, OpenCode, Codex, Pi, Cursor and Hermes all exist, and the catalog row is present.
- [x] T004 Record the operator's workspace choice. Evidence: "Current branch (main checkout)", 2026-09-26.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Update the root README: fifteen modes across fourteen packets, a goal-authoring line and a `/create:goal` entry (`README.md`).
- [x] T006 Update the sk-doc hub README: description, overview, when-to-use, command list, FAQ and a related-documents row (`.skilled/skills/sk-doc/README.md`).
- [x] T007 Add `/create:goal` to the `@markdown` agent's valid-command list and template map, set its count to thirteen, carry the edit to the Claude, Pi and Codex copies and regenerate the Hermes copy (`.skilled/agents/markdown.md`).
- [x] T008 Add `sk-create-goal` to both feature-catalog mode lists and update their counts (`.skilled/skills/sk-doc/feature-catalog/`).
- [x] T009 Move the `/speckit:save` memory-save wording from the committed TypeScript projection into `scoring-compatibility.json`, then regenerate the command bridges (`.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/`).
- [x] T010 Set the advisor metadata census to 21 (`.skilled/skills/system-skill-advisor/runtime/tests/command-metadata-e2e.vitest.ts`).
- [x] T011 Rebuild the create command asset roster from disk and set its YAML count to 26 (`.skilled/commands/create/assets/tests/`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run `python3 -m unittest discover .skilled/commands/create/assets/tests`. Evidence: 13 of 13 pass, where two failed before this phase.
- [x] T013 Run the bridge check, the advisor typecheck and the advisor tests. Evidence: `--check` reports `fresh`, typecheck exits 0, the bridge and routing files pass 22 of 22, and the full suite passes 896 of 907. Its five failures are outside this phase: the divergence ratchet on `rr-iter3-093`, which the committed Python scorer reproduces, and four hook cases another session added and has not committed.
- [x] T014 Run the agent and runtime mirror checks. Evidence: 12 agents in sync, 71 Hermes copies in sync, 170 runtime mirrors in sync.
- [x] T015 Validate the edited documents. Evidence: 0 issues on both READMEs and both catalog files, the agent's one finding is also in the committed file, and no file gained an HVR finding.
- [x] T016 Run the sk-doc gates. Evidence: guard fresh, leaf manifest OK, command references OK, catalog mirror OK, package PASS, parent-skill check OK, README manifest tests 11 of 11.
- [x] T017 Write this phase's nested changelog with `nested-changelog.js --write`.
- [x] T018 Run `validate.sh specs/sk-doc/060-create-goal-mode --recursive --strict`. Evidence: `RESULT: PASSED` for all 12 folders.
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
- [x] CHK-003 [P1] The operator's workspace choice is recorded before any file is written
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Regenerated projections come from the deriver, never from hand edits
- [x] CHK-011 [P0] No committed bridge wording changes in the regenerated scorers
- [x] CHK-012 [P1] Each pinned count matches what is on disk
- [x] CHK-013 [P1] The census comment states why the number moved, with no packet ids
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] The create command asset tests pass
- [x] CHK-022 [P1] The advisor bridge and routing tests pass
- [x] CHK-023 [P1] The remaining advisor failure is shown to predate this phase
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Not applicable. This phase adds references at the operator's request and repairs the counts they made stale. It does not remediate a review finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in any edited file
- [x] CHK-031 [P0] Another session's advisor files are left unstaged
- [x] CHK-032 [P1] No session-goal state is written
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree
- [x] CHK-041 [P1] Every mode count names fifteen modes across fourteen packets
- [x] CHK-042 [P2] The out-of-scope README gaps are recorded, not fixed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Probe files and the scratch checkout were removed
- [x] CHK-051 [P1] The trigger index was not regenerated in the shared checkout
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-26
<!-- /ANCHOR:summary -->

---
