---
title: "Implementation Summary"
description: "Write containment now excludes the folders of other live deep-loop runs for every caller, not only fan-out, so loops running side by side in one packet stop blaming each other; a new out-of-folder file is pinned as recorded."
trigger_phrases:
  - "write containment scoping implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/004-v4-release-line-research/008-write-containment-scoping"
    last_updated_at: "2026-11-09T00:00:00Z"
    last_updated_by: "remediation-orchestrator-a"
    recent_action: "Closed the phase with the final gate green and the review fixed"
    next_safe_action: "Start phase 015"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "orchestrator-a-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-write-containment-scoping |
| **Completed** | 2026-11-09 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two deep loops running at the same time in sibling phase folders no longer record each other's writes. A single-executor loop now gets the same live-run exclusion fan-out already had, with no change to its YAML.

### Phase 8: write-containment-scoping

The live-run discovery moved from the fan-out runner into the containment library. Snapshot and detection scan the top-level packet for folders holding a live deep-loop lock and leave their writes out of attribution. A stale lock grants nothing, and a write at the repository root is still recorded. A new test pins that a new out-of-scope folder's files are recorded in the event and the state log and returned as advisories.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | Modified | Live-run discovery, used in snapshot and detection |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | Calls the library discovery; local copy removed |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts` | Modified | Fixes the typecheck regression from phase 007 |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts` | Modified | Live, stale, repo-root and nested-folder cases |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A read-only Luna pass mapped the callers and the untracked-file behavior first. Luna moved the discovery and wrote the tests; DeepSeek corrected one test's assertions and reviewed the diff. The review returned CONDITIONAL; two Luna fix rounds closed the confirmed items, including a typecheck regression phase 007 had shipped.

| Suite | Command | Baseline | Final |
|-------|---------|----------|-------|
| Runtime vitest | `npx vitest run --no-coverage` in `runtime/` | 174 files, 2880 passed, 8 skipped | 174 files, 2884 passed, 8 skipped, exit 0 |
| Council vitest | `npx vitest run --no-coverage` in `deep-ai-council/` | 118 passed | 118 passed, exit 0 |
| Runtime typecheck | `npm run --silent typecheck` in `runtime/` | 2 errors (phase 007 regression) | exit 0, no output |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Record unowned out-of-folder writes; never auto-move them (ADR-001) | A shared worktree has other writers; moving a file punishes whichever run looks |
| Discover inside the library, not at each call site | Every caller gets the exclusion with no YAML edit |
| Load the lock module through `createRequire` | The library is loaded natively, so it needs the `.ts` specifier that tsc rejects in a static import |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Runtime vitest | PASS: 174 files, 2884 passed, 8 skipped |
| Council vitest | PASS: 118 passed |
| Runtime typecheck | PASS: exit 0 |
| Containment, ledger schema and fan-out files | PASS: 318 passed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A planted live lock exempts a folder.** A leaf that writes a lock naming a live foreign process into a sibling folder hides its writes there; fan-out had the same exposure before this phase.
2. **Discovery cost is unmeasured.** Each scope resolution walks the packet, bounded at depth 6 and 2000 directories.
3. **A run that releases its lock mid-iteration is re-attributed in single-executor mode.** Its leftover writes land on this run as advisories under the default preserve mode; fan-out unions the pre-dispatch set and is not affected.
4. **Ignored writes are invisible.** Containment reads `git status`, so a write under an ignore rule leaves no record; the `specs/001-test-feature/` miss remains UNKNOWN (D-07).
<!-- /ANCHOR:limitations -->

---
