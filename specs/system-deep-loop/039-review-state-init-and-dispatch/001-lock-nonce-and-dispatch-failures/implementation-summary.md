---
title: "Implementation Summary"
description: "Review and council runs now release their own lock, a failed dispatch is named from its receipt instead of showing as a missing file, a retry keeps the first attempt's receipt, and the review codex branch no longer removes a directory it never made."
trigger_phrases:
  - "lock nonce dispatch summary"
  - "dispatch failed reason"
  - "receipt attempt archive"
  - "event dir guard"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/039-review-state-init-and-dispatch/001-lock-nonce-and-dispatch-failures"
    last_updated_at: "2026-10-05T17:53:00Z"
    last_updated_by: "generate-context"
    recent_action: "Fixed lock nonce, receipt-named dispatch failures and the codex event loop"
    next_safe_action: "Run strict validation, then commit and push the phase"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs"
      - ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts"
      - ".skilled/commands/deep/assets/deep-review-auto.yaml"
    session_dedup:
      fingerprint: "sha256:7c3fff13e992283e36e36784311f3b23066d94693c33d8949a08d8a88aa831ac"
      session_id: "scaffold-001-lock-nonce-and-dispatch-failures"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-lock-nonce-and-dispatch-failures |
| **Completed** | 2026-10-05 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three defects from a live `/deep:review:auto` run are fixed. A review or council run now releases its own lock. A failed dispatch now says how it failed. And the review codex branch no longer runs cleanup against a variable it never set.

### Phase 1: lock-nonce-and-dispatch-failures

When you ran a deep review, the last step printed `released:false` and left the lock behind, because the release never passed the nonce the lock was taken with. The research workflows already passed it; review and ai-council now do the same. When an executor timed out or crashed, the verifier only said `iteration_file_missing`. The wrapper's own failure note was gone by then, because the state log is rebuilt from the ledger on every gateway append. The verifier now reads the completion receipt, which survives, and tells you `dispatch_failed` with the exit status or signal, how long it ran, and whether it hit the executor timeout. A retry no longer overwrites the first attempt's receipt: earlier pairs move to `attempt-N` names. The review codex branch ended with `rm -rf "$EVENT_DIR"` on a variable it never assigned. That tail is gone, and a new guard fails any workflow block that reads `$EVENT_DIR` without setting it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/deep/assets/deep-review-auto.yaml` | Modified | Nonce on release, `dispatch_failed` in the verifier note, unbound loop removed |
| `.skilled/commands/deep/assets/deep-review-confirm.yaml` | Modified | Nonce on release, `dispatch_failed` in the verifier note |
| `.skilled/commands/deep/assets/deep-ai-council-auto.yaml`, `deep-ai-council-confirm.yaml` | Modified | Nonce on release |
| `.skilled/commands/deep/assets/deep-research-auto.yaml`, `deep-research-confirm.yaml` | Modified | `dispatch_failed` in the verifier note |
| `.skilled/commands/deep/assets/compiled/deep-{review,research,ai-council}.contract.md` | Modified | Recompiled source digests |
| `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` | Modified | `dispatch_failed` from the completion receipt |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modified | `archivePriorAttempt` before a reused dispatch id |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-lock-release.vitest.ts` | Modified | Covers all six lock-taking workflows and a live review release |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/workflow-event-dir-binding.vitest.ts` | Created | `$EVENT_DIR` must be assigned in the block that reads it |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts` | Modified | Receipt-named dispatch failure |
| `.skilled/skills/system-deep-loop/runtime/tests/executor-audit-receipts.test.ts` | Modified | Retry keeps the earlier receipts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The lost failure event was reproduced first. On a scratch copy of the run directory, a wrapper-written `dispatch_failure` line was present before one gateway append and gone after it. Each fix then got one test. For each, the source was swapped back to its committed version with the new test kept, and the test failed: 5 lock checks, the old codex block at line 1474, and the two receipt cases. All passed again on the restored fix. The verifier was also run against the real 050 review directory, where it now names iteration 3's DeepSeek timeout.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Read the completion receipt rather than add a `dispatch_failure` ledger stem | The receipt already records exit and signal and survives the projection rebuild; a stem means schema, reducer and projection changes in two ledgers |
| Keep the latest attempt under the base receipt names | The post-dispatch validator reads only `dispatch-<id>.{intent,completion}.json`, so it keeps working unchanged |
| Fix the nonce in ai-council too | It takes the same lock and had the same release line, so leaving it would ship the defect a second time |
| Delete the codex loop rather than define its variables | The branch stages no events, so the loop could only ever act on an inherited `EVENT_DIR` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| New and widened tests on the pre-fix source | FAIL as intended: lock release 5 of 8, `EVENT_DIR` guard 1 of 11, receipt cases 2 of 37 |
| Same tests on the fix | PASS: 8/8, 11/11, 37/37 |
| Full deep-loop runtime suite | PASS: 169/169 files, 2839 passed, 8 skipped |
| Spec-kit deep-review and deep-research contract tests | PASS: 24/24 |
| `render-command-contract` after recompiling | PASS: 32/32 |
| Live verifier on the 050 run | iteration 3 reads `dispatch_failed ... cli-pi exited 143, after 899 s, at the 900 s executor timeout` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The `dispatch_failure` event is still lost from the state log.** The verifier no longer depends on it, but the event itself only survives in the receipt.
2. **A CLI that exits 0 after a quota error would still read as `iteration_file_missing`.** The receipt cannot tell that from success. Whether Codex exited 0 on its quota stop in the 050 run is unknown: the retry overwrote that receipt, which is the gap this phase's archive step closes.
<!-- /ANCHOR:limitations -->

---
