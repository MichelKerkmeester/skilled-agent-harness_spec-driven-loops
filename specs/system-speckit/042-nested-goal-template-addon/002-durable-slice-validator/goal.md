---
title: "Goal: Durable Slice Validator"
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
    packet_pointer: "system-speckit/042-nested-goal-template-addon/002-durable-slice-validator"
    last_updated_at: "2026-08-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the phase specification"
    next_safe_action: "Build the rule and register it"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:52dbe7d19613a27cf28cc38dec9175667534f2d9f241af1d2436a89e45fc0d7a"
      session_id: "2026-08-29-042-002-durable-slice-validator"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Durable Slice Validator

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Report a goal document that has drifted out of shape, before an operator discovers it by pasting a truncated objective.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Present-file: a packet with no goal document is never touched |
| D2 | The whole durable slice is measured; naming boilerplate would drift with the template |
| D3 | Budgets differ by shape because a parent carries a binding block |
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] A packet with no goal document produces no finding
- [ ] An over-budget durable slice is reported with its measurement
- [ ] A parent binding a child that does not exist names that path
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
| This phase | Pending | - |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | - |
<!-- /ANCHOR:log -->
