---
title: "Tasks: A Documented Flag That Reached Nothing"
description: "The ordered work for carrying convergence mode into a fan-out lineage."
trigger_phrases:
  - "fanout convergence mode tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/048-fanout-convergence-mode-flag"
    last_updated_at: "2026-09-11T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Closed every task"
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
# Tasks: A Documented Flag That Reached Nothing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

`[ ]` open · `[x]` done, with the evidence that closed it.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T1 Normalizer added beside the stop-policy one, accepting the four documented values.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T2 Flag parsed where the stop policy is parsed.
- [x] T3 Emitted into the prompt config the leaf reads.
- [x] T4 Emitted on the leaf's command line and in its setup bindings.
- [x] T5 Threaded through both call sites that build a lineage prompt.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T6 `node --check` clean.
- [x] T7 Bad value rejected: `convergenceMode must be one of: default, off, sliding-window, divergent`.
- [x] T8 Good value accepted; the run proceeds past input validation.
- [x] T9 All three emission points confirmed present in the runner.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

Every task closed with evidence, and the success criteria in `spec.md` met.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- `spec.md` — the problem and its requirements.
- `plan.md` — the phases these tasks implement.
<!-- /ANCHOR:cross-refs -->
