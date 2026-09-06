---
title: "Implementation Plan: A Warning Stops Being A Failure"
description: "Measure a fixed sample, remove the promotion clause, then restore whatever enforcement depended on it."
trigger_phrases:
  - "warnings stop blocking plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/041-validation-reduction/001-warnings-stop-blocking"
    last_updated_at: "2026-08-29T18:45:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Recorded how the change was measured"
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
# Implementation Plan: A Warning Stops Being A Failure

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Measure a fixed sample first, so the change is judged against a number rather
than an impression. Remove the clause. Re-measure the same sample with the same
command and require that no packet moves from passing to failing.

Then find what the clause was silently holding up. A rule that only ever emits a
warning was enforcing nothing on its own; if its tests asserted a hard failure,
that enforcement lived in the promotion and disappears with it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Zero packets move from passing to failing.
- Every test that asserted a hard failure is examined, and each is either a
  contract change to record or an enforcement path to restore.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The verdict is computed in one expression. Strict mode reaches it twice: once to
select rules marked strict-only, and once to promote warnings. Only the second
use is removed, so a strict run still evaluates more rules than a plain one.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Measure

A stride sample over live packets, validated with the exact command the
completion rule mandates. Recorded per packet so the comparison is per packet
rather than in aggregate.

### Phase 2: Remove

Delete the promotion from the verdict expression.

### Phase 3: Restore what depended on it

Any rule whose enforcement was the promotion now states it: the rule emits a
failure, and its registry ceiling permits one.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The load-bearing check is the per-packet comparison across the same sample
before and after. Aggregate pass rates can improve while individual packets
regress, so the count that matters is packets that moved from pass to fail.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The rule registry, whose severities become meaningful for the first time.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The change is one expression and the enforcement corrections are three lines
across two rule scripts and the registry. Reverting the commit restores the
previous behaviour exactly; no packet content was touched.
<!-- /ANCHOR:rollback -->
