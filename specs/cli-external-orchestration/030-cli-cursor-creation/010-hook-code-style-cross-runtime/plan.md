---
title: "Implementation Plan: Cross-runtime hook code style alignment"
description: "Technical approach for extending phase 013's Cursor-only hook style alignment to all 32 hook entrypoints across the four runtimes."
trigger_phrases: ["cross-runtime hook style plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/010-hook-code-style-cross-runtime"
    last_updated_at: "2026-07-24T19:55:00Z"
    last_updated_by: "claude-code"
    recent_action: "Plan executed; two-pass scripted sweep applied and verified"
    next_safe_action: "Run validate.sh --strict, then commit"
    blockers: []
    key_files: ["spec.md", "tasks.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cross-runtime-hook-style", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Cross-runtime hook code style alignment

<!-- ANCHOR:summary -->
## 1. SUMMARY
Two scripted passes bring all 32 `.cjs`/`.mjs` hook entrypoints to their language's P0 header standard and add numbered section bands, with an exhaustive non-comment diff assertion as the acceptance test for behavior preservation.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
| Gate | Command | Threshold |
|---|---|---|
| Syntax | `node --check` per file | 32/32 pass |
| Alignment drift | `verify_alignment_drift.py --root <7 hook dirs>` | 0 findings, 0 errors, 0 warnings |
| Comment hygiene | `check-comment-hygiene.sh` per file | 0 violations |
| Behavior preservation | non-comment diff filter | exactly 9 `'use strict';` removals, nothing else |
| Runtime smoke | live payload per runtime | identical envelopes and exit codes |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
No architectural change. This phase edits comments in leaf hook entrypoints only; no shared runtime-neutral core, registration file, or build artifact is touched, so the hook dependency graph is identical before and after.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Audit and escalate
Read the three checklists fresh. Survey every hook file's current header style and section state. On finding that the requested uniform header contradicts the per-language P0 standard, stop and escalate with the citation rather than picking a side.

### Phase 2: Header pass
Insert the P0 box header immediately after the shebang, preserving each file's existing prose block directly beneath it, and drop `'use strict'` only from `.mjs`. Idempotent — a file already carrying a box glyph is skipped, which is how Cursor's five phase-013 files pass through untouched. Box geometry is measured in Python from a committed phase-013 file (79-character rows, 73-character text budget) and asserted at build time, so a miscount fails loudly instead of shipping a ragged box.

### Phase 3: Section pass
Classify each top-level line as import / module constant / helper / `main` / trailing entrypoint, then emit a band only for constructs the file actually has, numbered in encounter order. Two refinements matter: an anchor walks backwards over the comment run directly above it so explanatory prose stays attached to the construct below the band, and the scan starts after the header block so banner prose is never read as body.

### Phase 4: Verification
Run every gate in §2, then review one file end-to-end top to bottom before trusting the batch.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
The load-bearing test is the **non-comment diff assertion**: filter the unified diff to added/removed lines, drop comments and blanks, and confirm the remainder is exactly the 9 `'use strict';` removals. That is stronger evidence than any number of smoke tests because it covers all 32 files exhaustively rather than sampling.

Smoke tests then confirm runtime envelopes are unchanged in practice: a real dispatch command must still produce its hard-rule advisory, Cursor must still emit `{"permission":"allow"}`, Devin's PostCompaction must still emit its `hookSpecificOutput`, and malformed stdin must still fail open.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Status | Note |
|---|---|---|
| Phase 013's box-header format and `.mjs` `'use strict'` rule | Green - Complete | Reused verbatim rather than re-derived |
| `code-opencode` checklists | Green - present | The standard being conformed to |
| `verify_alignment_drift.py` | Green - present | Independent automated confirmation |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Every edit is comment-only apart from the `'use strict'` removals, and all 32 files are tracked, so `git checkout -- <paths>` restores the prior state exactly. No build artifact, registration file, or shared core is touched, so nothing else needs reverting alongside.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
Phase 1 gates everything — the escalation outcome determines which header each language gets. Phase 3 depends on Phase 2 only for file ordering convenience, not correctness; both passes are independently idempotent.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
| Phase | Effort |
|---|---|
| Audit and escalate | Small, dominated by reading the three checklists carefully enough to catch the per-language split |
| Header pass | Small; one off-by-one caught by assertion |
| Section pass | Medium; the comment-carry and target-list fixes were both found during dry-run review |
| Verification | Small |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK
If a regression surfaced after commit, `git revert` of the single commit restores all 32 files atomically. Because no shared core or registration changed, a partial revert of individual files is also safe and needs no coordinating change elsewhere.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`
- `../009-cursor-hooks-lifecycle/005-hooks-sk-code-alignment/plan.md` (the Cursor-only approach this generalizes)
