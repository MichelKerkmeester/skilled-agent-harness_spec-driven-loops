---
title: "Implementation Summary"
description: "A baseline untracked file the lane deleted is detected with its hash, restored from the captured copy under restore, or recorded as unrecoverable."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/009-baseline-deletion-detection"
    last_updated_at: "2026-09-14T17:44:14Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Added baseline deletion detection and filled the packet docs"
    next_safe_action: "Commit once the full suite exits zero"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-baseline-deletion-detection"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-baseline-deletion-detection |
| **Completed** | 2026-09-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

A lane can no longer delete a neighbour's untracked file unnoticed. `snapshotOutOfScopeDirtyPaths` in `runtime/lib/deep-loop/write-containment.ts` now records which baseline entries were untracked, the only moment that fact is observable; `detectNewOutOfScopeViolations` keeps its status pass and adds a reverse pass that reports a baseline untracked path missing from status and from disk as a `deleted` violation carrying the baseline hash; and `revertOutOfScopeViolations` writes the captured baseline copy back under restore, recreating the directory, or records the loss as `unrecoverable`. A path deleted before dispatch stays subtracted.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One dispatch to DeepSeek V4.1 Flash at max through the gateway on cli-pi. Two of the three new tests failed against the unmodified detector with nothing reported; the third, the pre-dispatch guard, passed before and after. The orchestrator reviewed the diff and ran the whole suite before committing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Decide by disk, not by status absence | A status call that failed open must not manufacture deletions |
| No HEAD fallback for an untracked deletion | The path was never in HEAD; the baseline copy is the only source |
| Leave the data-loss flag keyed on HEAD restores | Widening it lives in the event builder, outside this change; noted for the retention phase |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Deletion tests against unmodified detector | FAIL as expected: nothing reported |
| Both touched test files plus typecheck | PASS, exit 0, 211 tests |
| Full deep-loop suite | `npm test` in the runtime: 151 files, 145 passed and 6 failed, 2583 tests passed; the six failures are the cli-adapter manifest-integrity cases still broken by another session's uncommitted cli-hermes manifest edit, unrelated to this change; the containment and fan-out files passed (211 tests), typecheck exit 0 |
| `validate.sh --strict` on this phase | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Data-loss flag.** The containment event's data-loss flag still keys only on HEAD restores; an unrecoverable deletion is not reflected in it.
<!-- /ANCHOR:limitations -->

---


