---
title: "Goal: documentation matches what ships"
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
    packet_pointer: "hooks/016-cache-optimizer-absorbs-deep-pi/006-reconcile-extension-documentation"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-016-006-reconcile-extension-documentation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: documentation matches what ships

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The root README and every other README or inventory that documents Pi extensions describes the extensions that actually exist and what they now do.

### Decisions

Frozen choices for this phase. The parent goal's decisions bind here too; changing one of those is
an amendment to `../goal.md`.

| ID | Decision |
|----|----------|
| P1 | Runs last, after 001-005 are done and tested, so it documents shipped behavior rather than intent |
| P2 | Every claim is checked against the tree, not carried over from the previous wording |
| P3 | Historical records stay as they are; only live documentation is reconciled |

### Completion criteria

1. No README lists a retired extension as live.
2. The surviving extension's documented capabilities match what it does.
3. Documentation validators pass on every changed file.

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

- [x] No live document lists a retired extension as installed
- [x] Documented capabilities match what the code does
- [x] The root README question is answered explicitly
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 2. LOG

| Date | Event |
|------|-------|
| 2026-09-08 | Phase goal authored |
<!-- /ANCHOR:log -->
