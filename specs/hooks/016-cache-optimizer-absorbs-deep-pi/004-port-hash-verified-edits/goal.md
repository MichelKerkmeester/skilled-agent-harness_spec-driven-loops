---
title: "Goal: hash-verified edits"
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
    packet_pointer: "hooks/016-cache-optimizer-absorbs-deep-pi/004-port-hash-verified-edits"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-016-004-port-hash-verified-edits"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: hash-verified edits

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** An edit is applied only when the target still hashes to what the model was shown; otherwise it is refused.

### Decisions

Frozen choices for this phase. The parent goal's decisions bind here too; changing one of those is
an amendment to `../goal.md`.

| ID | Decision |
|----|----------|
| P1 | Refusal is the failure mode. A stale hash never falls back to a fuzzy match |
| P2 | The refusal names what drifted so the next attempt can be correct |

### Completion criteria

1. A drifted target is refused, proven by a test that moves content between read and write.
2. An unchanged target applies normally.
3. Refusal text identifies the drift.

### Operator copy

The operator holds the parent directive as the session objective. A change here that alters a
parent decision or criterion is an amendment to the parent: apply it there and resend that file.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

| Surface | Bound to |
|---------|----------|
| Parent goal | `../goal.md` |
| Phase spec | `spec.md` |
| Closure gate | `acceptance-criteria.md` |
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] An edit whose endpoint hashes drifted is refused
- [x] An edit against an unchanged target applies normally
- [x] Refusal never falls back to a fuzzy match
- [x] The refusal names what drifted
- [x] The capability is relocatable
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 2. LOG

| Date | Event |
|------|-------|
| 2026-09-08 | Phase goal authored |
<!-- /ANCHOR:log -->
