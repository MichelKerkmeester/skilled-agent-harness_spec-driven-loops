---
title: "Implementation Plan: State records a deep loop can trust"
description: "How the timestamp choke point and the completion fallback were landed without touching 145 templates or any scoring contract."
trigger_phrases:
  - "deep loop state record plan"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/005-trustworthy-state-records"
    last_updated_at: "2026-07-27T16:10:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Landed both fixes with covering tests"
    next_safe_action: "Watch the next real fan-out for a quiet timestamp_anomaly channel"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: State Records A Deep Loop Can Trust

<!-- ANCHOR:summary -->
## 1. SUMMARY

Both defects have a single narrow fix, and the leverage came from finding the right place rather than
the right rule. Every state record in every deep loop is appended through one helper, so timestamping
there reaches 145 placeholders across 12 command files without editing any of them. Completion is
decided in one validator, so widening it from a spelling check to an evidence check is one function.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Command | Threshold |
|---|---|---|
| New coverage | `npx vitest run tests/unit/trustworthy-state-records.vitest.ts` | All pass |
| No regression | `npx vitest run tests/unit/lineage-timestamp-window.vitest.ts tests/unit/observability-events.vitest.ts` | No new failures against baseline |
| Syntax | `node --check` on both changed scripts | Clean |
| Packet | `validate.sh --strict` | Exit 0 |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The append helper is the only path a state record travels, which makes it the correct place to assert
what a producer cannot know. It sets the observed time and moves the producer's claim aside rather than
deleting it, because that claim is the only evidence fabrication is happening at all.

The validator moves from asserting a self-report to reading evidence. An event name is a claim about
work; the report file and the iteration files are the work. Where they disagree, the artifacts win.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Trustworthy Time

| Step | Work | Exit condition |
|---|---|---|
| 1 | Stamp the observed time in the append helper | A future timestamp is stored as the append time |
| 2 | Preserve the producer claim | The submitted value survives under its own field |

### Phase 2: Evidence-Based Completion

| Step | Work | Exit condition |
|---|---|---|
| 3 | Recognise the synthesis names producers wrote | All three observed names match |
| 4 | Fall back to artifacts, with the directory threaded in | A completed lineage passes with an unrecognised name |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The fixtures use the literal strings from the runs that failed, so the test documents the defect rather
than an abstraction of it. The fallback assertion checks that the lineage directory is threaded in
explicitly, because the obvious implementation reads a field the lineage config does not carry and
would never fire.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The fan-out runtime and the deep-command state-record contract.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

One commit, two files plus a test. Reverting restores the exact-name match and the pass-through
timestamp; no data migration is involved because existing logs are untouched.
<!-- /ANCHOR:rollback -->
