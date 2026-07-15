---
title: "Implementation Summary: Phase 11: create-sh-parent-corruption-fix"
description: "Guarded create.sh's parent description.json regeneration behind APPEND_TO_EXISTING_PARENT, added a regression fixture, and repaired the one already-corrupted packet."
trigger_phrases:
  - "create.sh parent corruption fix summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality/014-create-sh-parent-corruption-fix"
    last_updated_at: "2026-07-06T18:49:55.567Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Shipped and tested"
    next_safe_action: "None - phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/create.sh"
      - ".opencode/skills/system-spec-kit/scripts/tests/test-phase-system.sh"
      - ".opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/description.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-phase-011-create-sh-corruption-20260702"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 048-create-sh-parent-corruption-fix |
| **Status** | Complete |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Fixed `create.sh`'s append-mode parent-description regeneration bug (T1-P1-001, T1-P1-002, T1-P1-003 from `../047-generated-metadata-status-integrity/review/review-report.md`). Append-mode phase scaffolding (`--phase --phase-parent <existing>`) still rebound `FEATURE_DIR` to the existing parent correctly, but then unconditionally called the parent-description generator against it too, overwriting the parent's real `specFolder`/`description`/`keywords`/`parentChain` with the append request's own child-phase text. The fix guards that one call site behind the same `APPEND_TO_EXISTING_PARENT` flag the file already uses for its other append-mode branches. The one confirmed already-corrupted packet was repaired.

### create.sh No Longer Touches an Existing Parent's Own Metadata

`create.sh:1310-1321`'s parent `description.json` regeneration is now wrapped in `if [[ "$APPEND_TO_EXISTING_PARENT" != true && -f "$_DESC_SCRIPT" ]]`, so it only fires for genuine new-parent creation. The separate child-phase metadata call (`:1351-1361`) was already correct and is untouched.

### The Corrupted Packet Was Repaired

`system-speckit/004-memory-search-intelligence/001-speckit-memory/description.json` had `specFolder: "001-speckit-memory"` (missing the packet-path prefix), `specId` holding the full path (backwards from its correct short numeric form), and `parentChain: []`. Repaired via a surgical edit to match the pattern of sibling phase-parent packets (`002-code-graph`, `002-skill-advisor`): `specFolder` now the full path, `specId: "001"`, `parentChain: ["system-speckit", "004-memory-search-intelligence"]`. `description`/`keywords`/`folderSlug` were already correct and left untouched. Discovered during the repair that `specs/` is a symlink to `.opencode/specs/` (same inode) — the review's "2 physical files" was one physical file accessed via two paths, so the single edit repairs both.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/scripts/spec/create.sh` | Modified | Guarded the parent `description.json` regeneration call behind `APPEND_TO_EXISTING_PARENT != true`, with an inline comment documenting the invariant. |
| `.opencode/skills/system-spec-kit/scripts/tests/test-phase-system.sh` | Modified | Added a recording generator stub (the real generator is workspace-linked and cannot run in the sandboxed temp repo) and a new test block asserting: new-parent creation still invokes the generator, append mode never invokes it against the parent's own path, and append mode still generates the new child's own `description.json`. |
| `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/description.json` | Repaired | Corrected `specFolder`/`specId`/`parentChain` to match sibling phase-parent packets. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Located the exact call site via the review's own citations, then confirmed the two `generate-description` call sites in `create.sh` (parent at `:1315`, child at `:1355`) via `rg`. Applied the guard, then wrote a regression fixture: since the real description generator depends on the workspace-linked `@spec-kit/mcp-server/api` package that cannot be copied into the throwaway `mktemp` sandbox `test-phase-system.sh` already uses for its other two tests, a small recording stub stands in for it, logging each invocation's target path and `--level` so the test can assert on WHICH paths `create.sh` attempted to write to, independent of the real generator's own output correctness. Confirmed the fixture actually catches the regression (not just passes trivially) by temporarily reverting the `create.sh` fix via `git stash` and re-running: the fixture failed exactly as expected, then passed again once the fix was restored. The corrupted packet's repair was a direct read-compare-edit against the sibling pattern, not a scripted classifier — the review's own iteration-3 scan had already exhaustively confirmed there was exactly one candidate, so re-deriving that with a new tool would have duplicated already-confirmed work for a one-off repair.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Stub the description generator in the test rather than making it runnable in the sandbox | The real generator imports `@spec-kit/mcp-server/api`, a workspace-linked package that cannot be resolved from a throwaway `mktemp` directory without a full node_modules link; a recording stub tests the actual thing that matters (which paths get written to) without that dependency. |
| Assert on invocation targets, not on `description.json` content/hashes | The stub cannot produce a realistic `description.json`, so byte-stability assertions against its output would be meaningless; asserting on the generator's call arguments is the precise, dependency-free signal for this specific bug. |
| Skip building a standalone repair classifier script | The review's iteration-3 blast-radius scan already exhaustively identified the single candidate using the exact `isPhaseParent()` rule this phase's plan called for; building a separate tool to re-derive an already-confirmed, one-off result would be over-engineering. |
| Surgical field-level repair, not a full description.json regenerate | The corrupted packet's `description`/`keywords`/`folderSlug` were already correct (confirmed by the review: the parent's own `spec.md` was never overwritten, only identity/lineage metadata was). Regenerating the whole file risked picking up incidental drift from the current `spec.md` content instead of a minimal, reviewable fix. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fresh `test-phase-system.sh` run after the fix | PASS: 8/8 (5 pre-existing + 3 new) |
| Regression proof: fixture against pre-fix `create.sh` (via `git stash`) | FAIL as expected - append mode reached the parent's own path |
| Regression proof: fixture against post-fix `create.sh` (stash restored) | PASS - append mode never reaches the parent's path |
| Repaired `001-speckit-memory/description.json` read-back | `specFolder`/`specId`/`parentChain` match the pattern of sibling phase-parent packets |
| `bash validate.sh <this-folder> --strict` | 0 errors after graph-metadata backfill |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The 332 "related metadata drift" records the review's blast-radius scan also surfaced are not repaired here.** Different signature (absolute-root `parentChain` values, `system-spec-kit`/`system-speckit` path-spelling mismatches), explicitly deferred by the review as a separate data-quality question - not this phase's scope.
2. **No general-purpose repair tool was built.** The repair was a one-off, scoped, surgical edit to the single confirmed candidate; a future recurrence of this corruption signature (should the guard ever regress) would need its own detection pass.
3. **`validate.sh --strict` reports a `SECTION_COUNTS` warning** ("spec.md has 9 sections, expected at least 25 for Level 1"). Confirmed pre-existing and unrelated to this phase's content: the identical warning class reproduces on `046-drift-audit-deep-history-correction`, a long-committed, unrelated sibling phase, so the threshold is currently miscalibrated repo-wide for lean Level-1 docs rather than reflecting a real content gap in this phase's `spec.md`. Not remediated here - out of scope, and padding the doc with extra headers to dodge the threshold would be gaming the check rather than fixing anything real.
<!-- /ANCHOR:limitations -->

---
