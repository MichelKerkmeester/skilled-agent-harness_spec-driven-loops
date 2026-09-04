---
title: "Goal: Cross-Hub Vocabulary"
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
    packet_pointer: "sk-doc/052-routing-completeness/004-cross-hub-vocabulary"
    last_updated_at: "2026-09-02T18:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-004-cross-hub-vocabulary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Cross-Hub Vocabulary

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE. Keep it short: goal surfaces cap what
> they hold, and a truncated objective loses its tail, where the criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Settle the collisions that keyword ownership can settle, re-measure both hubs, and state plainly what keyword ownership cannot reach.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Only vocabulary-shaped collisions are in scope; prompts that match no declared word are not |
| D2 | Both hubs are re-measured after any change, and neither may lose a prompt it owns |
| D3 | Duplicate uncompiled entries under bare executor names are removed, not reweighted |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Copy these into the objective verbatim. Nothing dereferences a path.

- [x] Before and after tables show neither hub lost a prompt it owned
- [x] Canaries pass and every touched manifest is regenerated
- [x] What keyword ownership cannot reach is written down rather than absorbed
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
| Phase re-scoped after measurement | Done | `4a5de9e52b` narrows the phase the Gate B number invalidated |
| Single-word swallowing fixed | Done | Register findings 16, 17 and 18 read Fixed |
| Remaining collisions owned | Done | Register findings 12 to 15 read Planned against this phase |

### Deviations and findings

| Item | Note |
|------|------|
| The original premise was half right | The collision is real, but 94 of 180 prompts contain none of the declared words in any form, so vocabulary work cannot move Gate B |
| The collision is wider than five hubs | A hub outside the measured five wins 14 rows |
<!-- /ANCHOR:log -->
