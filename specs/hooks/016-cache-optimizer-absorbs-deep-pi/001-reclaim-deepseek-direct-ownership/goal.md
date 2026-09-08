---
title: "Goal: reclaim the DeepSeek-direct models"
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
    packet_pointer: "hooks/016-cache-optimizer-absorbs-deep-pi/001-reclaim-deepseek-direct-ownership"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-016-001-reclaim-deepseek-direct-ownership"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: reclaim the DeepSeek-direct models

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** `pi-cache-optimizer` acts on `deepseek/deepseek-v4-flash` and `deepseek-v4-pro` again, and nothing in the tree exists to police a two-extension split.

### Decisions

Frozen choices for this phase. The parent goal's decisions bind here too; changing one of those is
an amendment to `../goal.md`.

| ID | Decision |
|----|----------|
| P1 | `isDeepPiOwned` and its six early returns are deleted, not disabled behind a flag |
| P2 | The shared ownership fixture and one-owner composition helper go only if nothing outside the split imports them; the phase reads importers before deciding |
| P3 | `isDeepSeekLikeModel` stays: it drives proxy compat warnings and is a different predicate |

### Completion criteria

1. The six hooks run for both DeepSeek-direct ids.
2. `isDeepPiOwned` has no definition, no call site and no export.
3. No test asserts a two-extension ownership split.
4. Non-DeepSeek behavior is unchanged, shown by the suite passing without edits to unrelated cases.

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
