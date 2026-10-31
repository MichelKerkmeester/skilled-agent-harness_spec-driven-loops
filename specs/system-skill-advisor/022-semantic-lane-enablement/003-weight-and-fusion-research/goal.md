---
title: "Goal: Weight and Fusion Research"
description: "The durable directive this phase executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/023-semantic-lane-enablement/003-weight-and-fusion-research"
    last_updated_at: "2026-09-03T00:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-023-003-weight-and-fusion-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Weight and Fusion Research

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE. Keep it short, because goal surfaces cap what
> they hold, and a truncated objective loses its tail, where the criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Write the research plan that chooses the lane weight, so phase 004 applies a measured number rather than a preference.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The plan is authored here and run later. Dispatch is a separate, separately gated action |
| D2 | Convergence is telemetry. The loop runs its full budget, so it cannot stop at an agreeable answer |
| D3 | Two executors, because one model agreeing with itself is not evidence |
| D4 | A sweep point is only comparable when the corpus hashes and the coverage count both match |
| D5 | Every model string is re-checked against its executor's own skill document before dispatch |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Copy these verbatim into the objective. Nothing dereferences a path.

- [ ] All six questions in `research/research-plan.md` name an artifact and a closing number
- [ ] A dry run of the written dispatch command halts before writing state and reports no missing input
- [ ] `research/measurement-regime.md` names the flag that substitutes fixture vectors and lists the metrics it affects
- [ ] The regression set names 444 declared signals, 180 realistic rows and 224 out-of-scope controls with their files
- [ ] `git status --porcelain` lists only paths under this phase folder
- [ ] The plan records the executor roster it was written against, with the date it was checked
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
| Preconditions confirmed | Pending | None yet |
| Questions drafted | Pending | None yet |
| Dispatch command written | Pending | None yet |
| Dry run clean | Pending | None yet |

### Deviations and findings

| Item | Note |
|------|------|
| The default gate cannot see the variable under test | The committed accuracy baseline is captured with the test flag set, which makes the lane use deterministic fixture vectors rather than real embeddings |
| The sweep needs no code edit | The lane registry reads a weight override from the environment and clamps each lane to the range zero through one, so a sweep point is a restart |
<!-- /ANCHOR:log -->
