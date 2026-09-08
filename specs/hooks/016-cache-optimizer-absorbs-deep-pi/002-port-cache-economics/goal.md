---
title: "Goal: measured cache economics for every model"
description: "The durable directive this phase executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks/016-cache-optimizer-absorbs-deep-pi/002-port-cache-economics"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-016-002-port-cache-economics"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: measured cache economics for every model

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Any model Pi reaches can report cache-read versus uncached input tokens, hit rate, actual input cost, estimated savings against fully uncached input, and detected prefix churn.

### Decisions

Frozen choices for this phase. The parent goal's decisions bind here too; changing one of those is
an amendment to `../goal.md`.

| ID | Decision |
|----|----------|
| P1 | Economics are read from Pi's real usage records, never estimated from request shape |
| P2 | A miss is counted, not dropped: an input-only response with no cache fields is a full miss in the denominator |
| P3 | No fixed hit rate is promised anywhere in output or docs; provider cache expiry can miss on a stable prefix |

### Completion criteria

1. A command reports the six figures for a non-DeepSeek model from real records.
2. Persistence survives a restart and migrates existing footer counters.
3. The report states its own uncertainty rather than implying a guarantee.

### Operator copy

The operator holds the parent directive as the session objective. A change here that alters a
parent decision or criterion is an amendment to the parent: apply it there and resend that file.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:log -->
## 2. LOG

| Date | Event |
|------|-------|
| 2026-09-08 | Phase goal authored |
<!-- /ANCHOR:log -->
