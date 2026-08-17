---
title: "Implementation Summary: Rollback Candidate Hash Hardening"
description: "Rollback-candidate.cjs now requires the current target to equal the promoted candidate hash exclusively; pre-ship rollback is removed. Landed in commit c4fc339e83 with a red-before/green-after negative test; re-verified 15/15 vitest passed."
trigger_phrases:
  - "rollback candidate hash hardening implementation summary"
  - "promoted-candidate-only rollback shipped"
  - "c4fc339e83"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/008-review-and-rollback-followup/003-rollback-candidate-hash-hardening"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/008-review-and-rollback-followup/003-rollback-candidate-hash-hardening"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "markdown-agent"
    recent_action: "Documented commit c4fc339e83 and re-ran the two touched test files to confirm 15/15 passed"
    next_safe_action: "None; packet complete, no follow-up required"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Was pre-ship rollback narrowed or removed? Removed entirely; the guard now requires the promoted-candidate hash exclusively, with no fallback acceptance path."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

> This packet is Complete. The fix landed in commit `c4fc339e83`; the evidence below combines that commit's diff with a fresh per-file vitest re-run captured during this documentation pass.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-rollback-candidate-hash-hardening |
| **Level** | 1 |
| **Status** | Complete |
| **Completion** | 100% |
| **Completed** | 2026-08-13 |
| **Commit** | `c4fc339e83` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The deep-improvement rollback path now enforces promoted-candidate-only authority. `assertRollbackHashGuard` in `rollback-candidate.cjs` previously accepted a current target matching either the pre-acceptance hash or the accepted-candidate hash, so a stale or pre-ship target state could authorize rollback of the wrong canonical target. The fix requires the current target hash to equal the accepted candidate's hash exclusively.

### Promoted-candidate-only guard (REQ-001)

`assertRollbackHashGuard` (`rollback-candidate.cjs`) deletes the `expectedRollbackSourceHashes` two-hash acceptance list and instead checks `currentTargetHash !== acceptedState.candidateHash` directly, failing with "unexpected canonical target state; expected accepted candidate" on any mismatch, including a stale pre-acceptance hash.

### Negative test and benchmark update (REQ-002, REQ-003)

A new negative test in `rollback-candidate-hash-guard.vitest.ts` proves a receipt-valid pre-acceptance target is now rejected, watched red-before/green-after per the commit message. `promote-candidate-benchmark.vitest.ts`'s pre-ship-rollback case was renamed from "allows pre-ship rollback but blocks rollback from unexpected target drift" to "blocks rollback before ship and from unexpected target drift", now asserting `status === 1` and a stderr match on `/unexpected canonical target state/`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs` | Modified | Removed dual-hash acceptance; require the promoted candidate hash exclusively |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/promote-candidate-benchmark.vitest.ts` | Modified | Updated the pre-ship-rollback case to expect rejection |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/rollback-candidate-hash-guard.vitest.ts` | Modified | Added the negative test proving pre-acceptance targets are rejected |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The fix landed as commit `c4fc339e83`. This documentation pass independently re-ran the two touched test files (`npx vitest run --config vitest.config.mjs shared/tests/rollback-candidate-hash-guard.vitest.ts shared/tests/promote-candidate-benchmark.vitest.ts` from `.opencode/skills/system-deep-loop/deep-improvement/scripts`) and confirmed 15/15 tests still pass in the current working tree.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove pre-ship rollback entirely rather than narrow its conditions | A partial fix (e.g. requiring both hashes to be present) would still let a stale pre-acceptance state authorize rollback in some cases; exclusive candidate-hash matching closes the gap completely |
| Update the benchmark's existing test case instead of only adding a new one | The old pre-ship-rollback-succeeds assertion would otherwise contradict the new behavior and mask a regression |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| REQ-001 guard requires promoted-candidate hash exclusively | PASS, `rollback-candidate.cjs` diff in commit `c4fc339e83` |
| REQ-002 negative test proves pre-acceptance target rejected | PASS, new test in `rollback-candidate-hash-guard.vitest.ts` |
| REQ-003 benchmark pre-ship case expects rejection | PASS, `promote-candidate-benchmark.vitest.ts` asserts `status === 1` and stderr match |
| REQ-004 per-file vitest for both touched files | PASS, re-run during this documentation pass: `Test Files 2 passed (2)`, `Tests 15 passed (15)` |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Pre-ship rollback is now unsupported by design.** Any workflow that relied on rolling back before the candidate ships (i.e., while the canonical target still holds the pre-acceptance state) will now fail with "unexpected canonical target state." No caller was found depending on that behavior, and the benchmark's own pre-ship test case was updated to match.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE (~40 lines)
- Post-implementation documentation
- Created AFTER implementation completes
-->

