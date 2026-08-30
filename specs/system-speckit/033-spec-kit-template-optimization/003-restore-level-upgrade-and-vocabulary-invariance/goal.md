---
title: "Goal: Restore Level Upgrade and Vocabulary Invariance"
description: "The durable directive this phase executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-spec-kit-template-optimization/003-restore-level-upgrade-and-vocabulary-invariance"
    last_updated_at: "2026-08-30T04:17:55Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the phase goal document against the shipped template"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:548169c5aa9ca5dc9c92248134f317db4b315d26b98d43faf3ef0bc7164f7766"
      session_id: "2026-08-29-033-003-restore-level-upgrade-and-vocabulary-invariance"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Restore Level Upgrade and Vocabulary Invariance

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short -
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Restore the level-upgrade path the template restructure broke, and clear the public-surface vocabulary invariance.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Addenda are derived from two gated renders, not from deleted fragment files |
| D2 | The upgrade path creates the documents the target level requires |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Copy these verbatim into the objective: nothing dereferences a path, so criteria
left only here are invisible to whatever judges completion.

- [x] Upgrading a packet's level produces the documents that level declares
- [x] The public surfaces name one vocabulary for the same thing
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| This phase | Complete | Shipped alongside phase 002 |

### Deviations and findings

| Item | Note |
|------|------|
| Authored after the fact | This document was written once the goal template shipped in packet 042; the directive it records is the one the phase actually executed against. |
<!-- /ANCHOR:log -->
