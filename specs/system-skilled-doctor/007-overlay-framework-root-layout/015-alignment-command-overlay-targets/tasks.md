---
title: "Tasks: Phase 15: alignment-command-overlay-targets"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "alignment command overlay targets tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 15: alignment-command-overlay-targets

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Back up both private commands before any edit (`/tmp/ovl-gates/private-backup/`). Verify: `diff -rq /tmp/ovl-gates/private-backup/local-doc-alignment .skilled/commands/assets/local-doc-alignment` printed nothing at the start.
- [x] T002 Read both commands, their assets and `tests/resolve-scope.test.cjs` (`.skilled/commands/assets/`). Verify: `implementation-summary.md` names the setting and the engine's `resolveOverlayDir` that resolves it.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the `overlay-layout` topic (`.skilled/commands/assets/local-doc-alignment/topics.json`). Verify: the new ldoc test lists the overlay READMEs.
- [x] T004 Resolve the folder named by `.skilled-overlays.json` if the script cannot yet (`.skilled/commands/assets/local-doc-alignment/doc-alignment.cjs`). Verify: the no-config fixture yields the engine docs and no error.
- [x] T005 Add the `overlays` target (`.skilled/commands/assets/local-skilled-alignment/resolve-scope.cjs`, `surface-map.yaml`). Verify: the new `resolve-scope.test.cjs` cases pass.
- [x] T006 [P] List the topic and target in the command docs (`.skilled/commands/local-doc-alignment.md`, `local-skilled-alignment.md`, their assets). Verify: `rg -n 'overlay-layout|overlays' .skilled/commands/local-*-alignment.md` prints a line for each.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run both suites (`.skilled/commands/assets/*/tests/`). Verify: each exits 0 and the lsa count is above 68.
- [x] T008 Run `bash .skilled/commands/doctor/scripts/route-validate.sh`. Verify: prints `OK` and exits 0.
- [x] T009 Copy the edited command docs from the worktree into the Skilled checkout's private copy. Verify: `diff` of each pair prints nothing.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The Barter mirror change is listed in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



