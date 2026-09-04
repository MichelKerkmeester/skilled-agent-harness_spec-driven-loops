---
title: "Tasks: Chart review remediation"
description: "The work the remediation did, each row carrying the evidence that closes it."
trigger_phrases:
  - "chart remediation tasks"
  - "chart review task list"
  - "black cell tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/054-chart-review-remediation"
    last_updated_at: "2026-09-04T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Closed each row against its kept evidence"
    next_safe_action: "None open"
    blockers: []
    key_files:
      - "scratch/negative-controls.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-04-054-chart-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The order was set by what a reader would see first"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:setup -->
## 1. SETUP

- [x] T-001 Capture the corpus check before anything changes, so every later number has a
  control (`scratch/baseline-render.txt`).
- [x] T-002 Reproduce each reported defect before fixing it, rather than trusting the report.
<!-- /ANCHOR:setup -->

---

<!-- ANCHOR:implementation -->
## 2. IMPLEMENTATION

- [x] T-003 Clamp the band arithmetic at both ends in the matrix form and in the delivery
  carrying the same function. A zero and a negative now take a defined class rather than
  falling through to black (`scratch/band-zero-and-negative.txt`).
- [x] T-004 Give the five capacity-bearing forms a defined fill past the ceiling and a notice
  naming the count. Black pixels fall to zero in all five, and the notice goes from absent to
  present (`scratch/capacity-before-after.txt`).
- [x] T-005 Recompute all twenty-seven headlines against their own data blocks. Eight rewritten,
  nineteen stand, and the four that turned on a reading are recorded with both readings
  (`scratch/headline-audit.txt`).
- [x] T-006 Give the data table the pan the figure already had. The two files that overflowed a
  500 unit viewport now match it (`scratch/narrow-500-before.txt`, `scratch/narrow-500-after.txt`).
- [x] T-007 Fix the three axis captions that collided with their own maximum ticks. The measured
  collision count goes from three to zero (`scratch/parallel-axes-bbox-after.txt`).
- [x] T-008 Add a rule that an indexed class carries the token of its own index, which is the
  hole that let a reversed ramp pass green.
- [x] T-009 Cover the helper path the type-scale rule was blind to, since every form sets
  attributes through it.
<!-- /ANCHOR:implementation -->

---

<!-- ANCHOR:verification -->
## 3. VERIFICATION

- [x] T-010 Watch every new rule fail on a mutation, with the rule unwired as the control. Seven
  mutations kept with their output (`scratch/negative-controls.txt`).
- [x] T-011 Record the four holes left open, each with the mutation that proves it and what a fix
  would cost.
- [x] T-012 Run the corpus check from the final state, then run it again, because a browser open
  can die transiently and one red run is not a result (`scratch/final-render.txt`,
  `scratch/final-render-rerun.txt`).
- [x] T-013 Validate the packet strict and scan every document it holds.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:notes -->
## 4. NOTES

The order mattered. Fixing the arithmetic first meant the capacity work could assume every
finite value already lands on a defined class, so the notice is about a shape the form cannot
draw rather than about a colour it cannot find.
<!-- /ANCHOR:notes -->
