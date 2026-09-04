---
title: "Goal: Transport and Baseline"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/001-transport-and-baseline"
    last_updated_at: "2026-09-02T18:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-001-transport-and-baseline"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Transport and Baseline

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE. Keep it short: goal surfaces cap what
> they hold, and a truncated objective loses its tail, where the criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Name the scorer that governs automatic routing, with the code path that proves it, and freeze the baseline every later number is measured against.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The advisor daemon governs automatic routing; the Python scorer validates and never routes |
| D2 | A confidence of 0.82 is a floor, not a score, and is never reported as one |
| D3 | Rank comes from the comparator first element, never from re-sorting by the score field |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Copy these into the objective verbatim. Nothing dereferences a path.

- [x] The governing transport is named with a file and line a reader can open
- [x] Re-running the recorded baseline reproduces its numbers
- [x] The disagreement rate between the two scorers is recorded as a number
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Governing transport named | Done | `03f5db4876` settles which scorer governs routing |
| Baseline frozen | Done | Register findings 1 and 2 read Fixed |
| Rank source corrected | Done | Re-sorting by score inflated one hub from 7 to 44; register finding 3 |

### Deviations and findings

| Item | Note |
|------|------|
| The two scorers stay unreconciled | Reconciling them is a scoring change, which the parent D2 forbids inside this packet |
<!-- /ANCHOR:log -->
