---
title: "Goal: Gate A Signal Closure"
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
    packet_pointer: "sk-doc/052-routing-completeness/002-gate-a-signal-closure"
    last_updated_at: "2026-09-03T22:40:00Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded a decision for every unresolved signal"
    next_safe_action: "Hand the sk-doc activation-pin defect to its owner"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-002-gate-a-signal-closure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Gate A Signal Closure

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE. Keep it short: goal surfaces cap what
> they hold, and a truncated objective loses its tail, where the criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every declared signal across the five hubs resolve to exactly one mode, or retire it with the choice recorded.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Gate A is measured across all five hubs, not only the hub that gets audited |
| D2 | Rank is read from the comparator, since re-sorting by score inflated one hub from 7 to 44 |
| D3 | A signal that cannot resolve is retired, not parked in an unexplained bucket |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Copy these into the objective verbatim. Nothing dereferences a path.

- [x] A fresh sweep reproduces the Gate A count across all five hubs
- [x] No signal sits unclassified. Each has a resolution or a retirement beside it
- [x] The executor hub 115 signals are measured rather than assumed
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
| Gate A measured | Done | `dbc8678c9d` records 234 of 444 across five hubs |
| Unresolved vocabulary closed | Done | `08eb67a0de` resolves half the declared vocabulary that reached nothing |
| Executor hub measured | Done | 7 of 115 signals resolved, a hub nobody had measured before |
| Every unresolved signal decided | Done | `research/unresolved-signal-decisions.md` covers all 50 in twelve groups, one group per signal |

### Deviations and findings

| Item | Note |
|------|------|
| The distribution mattered more than the total | The documentation hub sat at 90 percent and drew every audit, while the executor hub sat at 6 percent and drew none |
| Most unresolved signals were already decided, in a file nobody had read | Nineteen of the 21 deferrals are vocabulary the hubs declare discovery-only in their own `hub-router.json`. The deferral was the contract working, not a gap |
| The re-sweep found a live defect outside this phase | `sk-doc` serves legacy on a stale activation pin since `756a7fcd4c`, which costs 96 signals their mode. Recorded and raised, not fixed here |
<!-- /ANCHOR:log -->
