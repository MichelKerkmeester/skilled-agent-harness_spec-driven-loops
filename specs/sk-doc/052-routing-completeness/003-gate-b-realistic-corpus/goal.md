---
title: "Goal: Gate B Realistic Corpus"
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
    packet_pointer: "sk-doc/052-routing-completeness/003-gate-b-realistic-corpus"
    last_updated_at: "2026-09-02T18:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-003-gate-b-realistic-corpus"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Gate B Realistic Corpus

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE. Keep it short: goal surfaces cap what
> they hold, and a truncated objective loses its tail, where the criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Commit a corpus of phrasings people actually type, record the rate at which they land, and separate work that would move that rate from work that would only look like it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The corpus uses phrasings that share no vocabulary with the declared keywords |
| D2 | The honest number is recorded even when it is worse than the keyword-shaped corpus that preceded it |
| D3 | Modes that route by command surface leave the denominator, because no prompt can reach them |
| D4 | The semantic lane is not enabled here; it moves to its own packet |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Copy these into the objective verbatim. Nothing dereferences a path.

- [x] The corpus is committed and a second run returns the same rate
- [x] The starting rate is recorded with its denominator
- [x] Every excluded row names why it was excluded
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
| Corpus committed and measured | Done | `4a5de9e52b` records 8 of 180, 20 counting the mode anywhere in the list |
| Denominator corrected | Done | `8c6d6fd455` removes the two command-surface modes |
| Structural cause located | Done | 94 of 180 return nothing; the semantic lane carries weight 0.05 and zero of 14 nodes are embedded |

### Deviations and findings

| Item | Note |
|------|------|
| The earlier 44 percent was not a regression | That corpus used phrasings close to the declared keywords, and the advisor matches keywords by substring |
| Stage two was never the problem | Right hub with the wrong mode happened zero times in 180 rows |
<!-- /ANCHOR:log -->
