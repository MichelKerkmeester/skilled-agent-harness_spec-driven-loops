---
title: "Implementation Summary"
description: "The Devin post-compaction hook now fits its notice inside 4096 bytes with the recovery pointer whole on every checkout, which turns the Spec-Kit Check runtime case green."
trigger_phrases:
  - "devin compaction fallback budget implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/013-devin-compaction-fallback-budget"
    last_updated_at: "2026-11-16T10:23:25Z"
    last_updated_by: "generate-context"
    recent_action: "Gave the Devin hook its own section fitter and proved it without the engine build"
    next_safe_action: "Commit, merge and push worktree 427 once the operator approves"
    packet_purpose: "Purpose: The Devin hook fits its notice the same way everywhere: at most 4096 bytes, only the summary shortened, the recovery pointer whole."
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs"
      - ".skilled/skills/system-spec-kit/runtime/tests/compaction-adapters.vitest.ts"
    session_dedup:
      fingerprint: "sha256:d938b64f5e8fa3eb338fc393a4efd9542eabfe58265c92dc38d912d8f509e961"
      session_id: "scaffold-013-devin-compaction-fallback-budget"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "ab672873-2f89-4541-9659-73a60e125e14"
      workspace: "/Users/michelkerkmeester/worktrees/public/427-devin-compaction-fallback"
      savedAt: "2026-11-16T10:23:25Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-devin-compaction-fallback-budget |
| **Completed** | 2026-11-16 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Devin session that compacts now always gets the `## Recovery` pointer back, and the notice never exceeds 4096 bytes. Before, that held only on a machine that had built the history engine. Everywhere else, CI included, the notice came out at 4099 bytes with the pointer cut off.

### Phase 13: devin-compaction-fallback-budget

The hook used to load its section fitter from the history engine's gitignored build output and fall back to a plain byte cut when that file was missing. The byte cut appended `...` after cutting at the full budget and cut through the end of the text, where the pointer sits. The hook now carries the same fitter in its own file: it shortens only the summary, keeps the spec folder and the pointer whole, and cuts on a character boundary. Because there is now one path, the same test checks the same code on your machine and in CI.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs` | Modified | Drop the build-output `require` and the byte-cut fallback, add the in-file fitter |
| `.skilled/skills/system-spec-kit/runtime/tests/compaction-adapters.vitest.ts` | Modified | Add a multi-byte case and five parity cases against the engine's TypeScript fitter |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The CI failure was reproduced first in a fresh worktree by moving `history/dist/` aside and running the CI command on the compaction file, which printed `expected 4099 to be less than or equal to 4096`. With the fix and the build still absent, the file passed 18 of 18. With the old hook restored, the same file failed 5 of 18, which shows the new cases catch the bug. With the build back in place, the whole runtime project and the history engine suites both passed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove the build-output path instead of only fixing the fallback | With both paths, the test checked the engine's fitter locally and the fallback in CI, which is how the failure survived six main pushes. One path means one tested behavior. The handoff asked for a fallback fix, and this deviation is recorded here and raised before the merge. |
| Keep a copy of the fitter in the hook and pin it with a parity test | The CommonJS hook cannot load the TypeScript source, and the build output is not present on a fresh checkout. The parity cases fail as soon as the two copies disagree. |
| Leave the CI step order alone | Building the engine before the runtime suite would turn CI green while a fresh checkout kept dropping the pointer. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline, runtime root project, build present | PASS: 111 files, 1485 passed, 13 skipped |
| Compaction file, build absent, old hook | FAIL as expected: `expected 4099 to be less than or equal to 4096` |
| Compaction file, build absent, fixed hook | PASS: 18 of 18 |
| Negative control, build absent, old hook with the new cases | 5 failed, 13 passed |
| Runtime root project after the fix, build present | PASS: 111 files, 1491 passed, 13 skipped |
| History engine build and suites | PASS: 10 files, 148 tests |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two copies of the fitter.** The hook and `lookup-offer.ts` each carry one. A change to the engine's fitter fails the parity cases until the hook's copy matches.
2. **Other build-output consumers.** `relaunch-core.cjs` and `history-lookup-entry.test.cjs` still load `history/dist/lookup-offer.js`. They serve the hand-over claim path, which needs the built engine, and are unchanged.
<!-- /ANCHOR:limitations -->

---
