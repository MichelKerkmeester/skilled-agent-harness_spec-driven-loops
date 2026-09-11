---
title: "Implementation Plan: A Documented Flag That Reached Nothing"
description: "Read the flag, validate it, carry it to the leaf."
trigger_phrases:
  - "fanout convergence mode plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/048-fanout-convergence-mode-flag"
    last_updated_at: "2026-09-11T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the plan"
    next_safe_action: "None outstanding"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-deeploop-048"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: A Documented Flag That Reached Nothing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

One normalizer beside the stop-policy one, one parse, and three emission points:
the prompt config the leaf reads, the leaf's command line, and its setup bindings.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- `node --check` clean on the runner.
- A bad value returns an input-validation error naming the four valid ones.
- A good value appears at all three emission points.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The runner already threads `convergenceThreshold` and `stopPolicy` the same way,
so the mode follows their path rather than inventing one. Absent stays absent:
the value is `null` when the flag is omitted and every emission is conditional,
which keeps existing callers byte-identical.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

**Phase 1.** Add the normalizer and parse the flag.
**Phase 2.** Emit it at the three points a lineage reads.
**Phase 3.** Prove a bad value fails and a good value lands.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Invoke the runner with a rejected value and read the error. Invoke it with an
accepted one and confirm the run proceeds past validation. Confirm the three
emission points carry the value.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Additive to one file. Reverting the commit restores the previous behaviour, and
no state is migrated.
<!-- /ANCHOR:rollback -->
