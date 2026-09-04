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
    last_updated_at: "2026-09-04T12:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Applied the seven fixes and measured the sweep on both sides"
    next_safe_action: "Hand the three scorer-held signals to the scorer owner"
    blockers: []
    key_files:
      - "research/unresolved-signal-decisions.md"
      - "research/gate-a-fix-after-2026-09-04.tsv"
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
| The decided fixes applied | Done | Seven fixes landed 2026-09-04, and RESOLVED moves 338 to 345 across `research/gate-a-fix-before-2026-09-04.tsv` and `research/gate-a-fix-after-2026-09-04.tsv`, with no hub losing a signal |
| The routing inputs re-pinned | Done | sk-code's policy hash moved on the `hub-router.json` edit, and both manifests were refreshed, guard exits 0 with five hubs fresh, all five canaries green |
| The accuracy gates held | Done | `score-routing-corpus.py` returns `overall_pass: true` with identical numbers on both sides, and the ratchet passes 7 of 7 on both sides |

### Deviations and findings

| Item | Note |
|------|------|
| The distribution mattered more than the total | The documentation hub sat at 90 percent and drew every audit, while the executor hub sat at 6 percent and drew none |
| Most unresolved signals were already decided, in a file nobody had read | Nineteen of the 21 deferrals are vocabulary the hubs declare discovery-only in their own `hub-router.json`. The deferral was the contract working, not a gap |
| The re-sweep found a live defect outside this phase | `sk-doc` serves legacy on a stale activation pin since `756a7fcd4c`, which costs 96 signals their mode. Recorded and raised, not fixed here |
| The measurement instrument had a bug worth more than the fixes | The sweep driver named reply files after a slug of the signal, and sixteen slugs collided. `deep-review` was scored against `deep review`'s reply and looked resolved. Every capture in this packet predating 2026-09-04 carries that flaw for those sixteen pairs |
| Four of the fourteen signals do not have their fix in the file the table named | `deep-review`, `dom inspect`, `task list` and `lighthouse` are all held by abstention gates in `lib/scorer/`, which no hub's `graph-metadata.json` can reach. The `lighthouse` attempt was made, measured, and reverted |
| Raising a phrase means moving it up a field, not editing a number | A phrase in `derived.trigger_phrases` alone caps confidence at 0.72 through the derived lane. The same phrase in the hub's top-level `intent_signals` reaches the explicit lane, whose direct score floors confidence at 0.82 |
<!-- /ANCHOR:log -->
