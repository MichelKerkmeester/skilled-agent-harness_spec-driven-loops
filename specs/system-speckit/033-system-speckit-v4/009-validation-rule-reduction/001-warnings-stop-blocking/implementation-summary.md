---
title: "Implementation Summary: A Warning Stops Being A Failure"
description: "One clause removed, two enforcement paths restored, and the pass rate measured per packet before and after."
trigger_phrases:
  - "warnings stop blocking status"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/041-validation-reduction/001-warnings-stop-blocking"
    last_updated_at: "2026-08-29T18:50:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Removed the strict warn promotion and restored two enforcement paths"
    next_safe_action: "Begin the next phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-speckit-041-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: A Warning Stops Being A Failure

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-warnings-stop-blocking |
| **Status** | Complete |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A warning no longer fails a run. Strict mode still selects the rules that only
run under strict; it no longer decides what a warning means.

Removing the promotion exposed something the promotion had been hiding. Two
rules advertise an enforcing mode, and both only ever emitted a warning — their
enforcement was entirely the global promotion. Taking it away would have
disabled them silently. Both now emit a failure when enforcing, and their
registry ceilings were raised so the dispatcher does not clamp that back to a
warning.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A fixed stride sample of 250 live packets was validated with the exact command
the completion rule mandates, and the result recorded per packet. The clause was
removed, the same sample re-run, and the comparison made per packet rather than
in aggregate — an aggregate can improve while individual packets regress.

Six tests failed afterwards. Each was read rather than adjusted: two were the
enforcement paths above and were fixed in the code, three asserted a hard
failure for rules that describe themselves as advice and were updated to assert
the finding is reported, and one built its fixture with a rule that is now
advisory, so the fixture no longer failed and its premise had to change.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Rationale |
|----------|-----------|
| Separate the two meanings of strict | Selecting rules and interpreting severity are different jobs that one flag was doing at once |
| Restore enforcement in the rule, not the caller | A rule that blocks should say so itself, rather than depending on a global promotion a caller might not apply |
| Keep the detection assertions when updating tests | The exit expectation encoded the old contract; what each test detects is still worth checking |
| Make the sweep fixture fail on a blocking rule | A fixture that establishes "known failing" using advice was never testing what it claimed |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|-------|--------|----------|
| Baseline captured per packet | PASS | 250 of 2,583 live packets, 99 passing (39.6%) |
| Pass rate after the change | PASS | 190 passing (76.0%), up 36.4 points |
| No packet regressed | PASS | Per-packet comparison reports 0 moving from pass to fail |
| Enforcement preserved | PASS | Both enforcing rules emit a failure and their tests assert it |
| Affected suites | PASS | 29 vitest cases in scripts, 13 in mcp-server, 117 in the chained shell suite |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The advisory tier is now genuinely advisory.** Rules registered as warnings
   report and do not block. That is the intent, but it means anything that was
   relying on the promotion without a test to prove it would have gone unnoticed;
   the two that had tests were caught.
2. **The pass rate is sampled.** 250 of 2,583 live packets, chosen by stride
   rather than at random.

<!-- /ANCHOR:limitations -->
