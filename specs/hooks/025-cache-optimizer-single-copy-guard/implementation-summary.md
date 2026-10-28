---
title: "Implementation Summary: Let a second pi-cache-optimizer copy stand down so pi starts in git worktrees"
description: "Pi starts in git worktrees again: the first pi-cache-optimizer copy in a load claims the package, and a copy at another real path registers nothing."
trigger_phrases:
  - "cache optimizer single copy guard implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/025-cache-optimizer-single-copy-guard"
    last_updated_at: "2026-10-28T09:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Copy claim built, tested and proven with a two-copy Pi run"
    next_safe_action: "Update the main checkout so its copy carries the claim"
    blockers: []
    key_files:
      - ".pi/extensions/pi-cache-optimizer/index.ts"
      - ".pi/extensions/pi-cache-optimizer/tests/copy-claim.test.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-025-cache-optimizer-single-copy-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Let a second pi-cache-optimizer copy stand down so pi starts in git worktrees

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 025-cache-optimizer-single-copy-guard |
| **Completed** | 2026-10-28 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Pi starts in a git worktree again without `-ne`. The extension still loads in every project through your user-level link, and in the main checkout nothing changes.

### Let a second pi-cache-optimizer copy stand down so pi starts in git worktrees

When Pi loads two copies of pi-cache-optimizer from different real paths, the first one claims the package on Pi's event bus and the second registers nothing. That ends the `edit_lines` conflict between your user-level link and a worktree's own copy. Two copies at one real path, as in the main checkout, both register as before.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.pi/extensions/pi-cache-optimizer/index.ts` | Modified | Copy claim and the guarded `createPiCacheOptimizerExtension` entry point |
| `.pi/extensions/pi-cache-optimizer/tests/copy-claim.test.ts` | Created | A copy standing down, and two copies at one real path |
| `.pi/extensions/pi-cache-optimizer/CHANGES-FROM-UPSTREAM.md` | Modified | Fork change record and verification line |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Reproduced the conflict from the worktree, took the 118-test baseline, then ported fast-mode's claim and added two tests. A Pi run from the worktree with `PI_CODING_AGENT_DIR` set to a throwaway agent folder proved it: linking to the old code printed the conflict, and linking to the new code did not.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the extension, not the user-level link | The link is deliberate setup, and the same claim already works for fast-mode |
| `__dirname` for the package root | The package is not an ES module, so `import.meta.url` fails the typecheck, while Pi's jiti loader provides `__dirname` |
| A host with no event bus keeps its copy | Such a host can load only one copy, and the existing tests' fakes have no bus |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm test` in the extension | PASS, `tests 120, pass 120, fail 0` (baseline 118) |
| `npm run typecheck` | PASS, exit 0 |
| Pi from the worktree, link to the old code | Reproduces `Tool "edit_lines" conflicts with ...` |
| Pi from the worktree, link to the new code | PASS, no extension error |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The fix needs both copies.** Your user-level link resolves to the main checkout, so worktree runs keep failing until the main checkout has this commit. Until then, `-ne` still works.
<!-- /ANCHOR:limitations -->

---
