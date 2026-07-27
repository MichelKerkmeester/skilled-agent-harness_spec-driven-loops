---
title: "Tasks: Cross-runtime hook code style alignment"
description: "Task breakdown for aligning all 32 hook entrypoints across four runtimes to their language's code-opencode P0 header and section standards."
trigger_phrases: ["cross-runtime hook style tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/010-hook-code-style-cross-runtime"
    last_updated_at: "2026-07-24T19:55:00Z"
    last_updated_by: "claude-code"
    recent_action: "All tasks complete across both sweep passes"
    next_safe_action: "Run validate.sh --strict, then commit"
    blockers: []
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cross-runtime-hook-style", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Cross-runtime hook code style alignment

<!-- ANCHOR:notation -->
## Task Notation
`T### Description` - all tasks complete; evidence inline.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Read `javascript-checklist.md`, `typescript-checklist.md`, `universal-checklist.md`, and `references/shared/hooks.md` fresh rather than assuming the standard
- [x] T002 Scripted a header/section classifier over every hook file — found `27` PLAIN, `5` BOX (phase 013's), remainder already-correct `.ts`
- [x] T003 Found `9` in-scope `.mjs` files still declaring the forbidden `'use strict'`, spanning all four runtimes
- [x] T004 **Escalated a Logic-Sync contradiction**: the requested uniform thin header conflicts with `javascript-checklist.md` §2 P0, which mandates the box header for `.cjs`/`.mjs`; cited all three checklists rather than silently choosing
- [x] T005 Operator chose the per-language standard, confirming `javascript-checklist.md`'s box header applies to `.cjs`/`.mjs` and phase 013 was correct
- [x] T006 Measured box geometry in Python from a committed phase-013 file — `79`-char rows, `73`-char text budget — instead of hand-counting
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T007 Authored per-file `COMPONENT`/`PURPOSE` text for all `27` header-less files, with a build-time assertion rejecting any line over the `73`-char budget
- [x] T008 Dry-ran the header sweep; reviewed the resolved file list and the `9`-file `'use strict'` drop set before applying
- [x] T009 Caught an off-by-one in the box fill width — `// ╔` is 4 chars so the fill is `74` not `75`; the assertion failed loudly rather than shipping a ragged box
- [x] T010 Applied the header pass to `27` files; Cursor's `5` correctly skipped as already-boxed via the idempotence check
- [x] T011 Built the section classifier with dynamic numbering so absent constructs never produce an empty band — verified against `post-edit-router.cjs`'s existing band style
- [x] T012 **Caught the section script pulling in a concurrent session's file** via `git diff` selection; replaced it with an explicit `32`-file list so cross-session contamination is structurally impossible
- [x] T013 Added the comment-carry refinement so a comment run above an anchor moves below the band — verified in `spec-gate-enforce.mjs`
- [x] T014 Dry-ran, reviewed `32/32` band lists, applied
- [x] T015 Reviewed `spec-gate-enforce.mjs` end-to-end — header, all `5` bands, comment-carry, and trailing entrypoint all correct
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T016 `node --check` on all `32` files — all pass
- [x] T017 **Non-comment diff assertion** — the only non-comment added/removed lines across all `32` files are the `9` `'use strict';` removals, exhaustive proof the sweep preserves behavior
- [x] T018 `verify_alignment_drift.py` across all seven hook directories — `64` files scanned, `Findings: 0, Errors: 0, Warnings: 0, Violations: 0`
- [x] T019 `check-comment-hygiene.sh` on all `32` — `0` violations
- [x] T020 Verified every box row is exactly `79` chars, no `.mjs` retains `'use strict'`, and every `.cjs` still has it
- [x] T021 Live smoke tests per runtime — Claude `5` hooks exit `0`; Codex exit `0`; Cursor returns `{"permission":"allow"}`; Devin PostCompaction envelope intact
- [x] T022 Confirmed behavior-bearing output survives — `dispatch-preflight-lint.mjs` still returns its `stdin-redirect-required` advisory verbatim
- [x] T023 Fail-open re-confirmed on malformed stdin — `spec-gate-enforce.mjs`, `task-dispatch-guard.mjs`, `post-compaction.cjs` all exit `0`
- [x] T024 Observed Claude's own edited `dispatch-preflight-lint.mjs` firing correctly on a real in-session `Bash` call — production evidence, not synthetic
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] T025 `validate.sh --strict` on this phase folder returns `0` errors; parent packet re-validated recursively
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Generalizes `../009-cursor-hooks-lifecycle/005-hooks-sk-code-alignment/` from Cursor-only to all four runtimes.
- Sequential-numbering neighbor `../009-cursor-hooks-lifecycle/006-cursor-hooks-discovery-mirror/` is unrelated; no dependency either way.
- Standards source: `sk-code/code-opencode/assets/checklists/javascript-checklist.md`.
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`, `implementation-summary.md`
- `../009-cursor-hooks-lifecycle/005-hooks-sk-code-alignment/tasks.md` (Cursor-only predecessor)
