---
title: "Goal: break paid retry loops"
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
    packet_pointer: "hooks/016-cache-optimizer-absorbs-deep-pi/003-port-retry-loop-guard"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-016-003-port-retry-loop-guard"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: break paid retry loops

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A turn that keeps failing the same way stops re-issuing the same billable request.

### Decisions

Frozen choices for this phase. The parent goal's decisions bind here too; changing one of those is
an amendment to `../goal.md`.

| ID | Decision |
|----|----------|
| P1 | The guard breaks a loop; it never silently rewrites the user's request to make one succeed |
| P2 | Guard state is per-session and never persisted across sessions |
| P3 | A broken loop surfaces the blocker rather than failing quietly |

### Completion criteria

1. A driven retry storm stops instead of repeating.
2. A single legitimate retry is unaffected.
3. The guard cannot fire on a first attempt.

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
