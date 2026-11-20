---
title: "Goal: Phase 21: epic-verification"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/021-epic-verification"
    last_updated_at: "2026-11-20T15:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0b81ad2f-04a7-4ad7-b174-0b3f9930b833"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 21: epic-verification

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Produce one independent report that checks the epic's Ollama claims and its other main advisor claims against the code at HEAD, one sourced verdict per claim, plus any defect the earlier checks missed.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The check runs once, read-only, as Fable 5.2 at high effort on the `claude2` account, which the operator named |
| D2 | Report only: no code, doc or config change outside this phase folder; fixes are a separate operator decision |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `evidence/report.md` exists and gives each of claims O1 to O6 and S1 to S4 a verdict of CONFIRMED, PARTIAL or REFUTED with a file:line source
- [x] `implementation-summary.md` lists every verdict that is not CONFIRMED, and every P0 or P1 defect, as confirmed or not by the conductor, with the line read
- [x] `git status --short` shows no change from the dispatch outside this phase folder, and `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Baseline | Done | 49 advisor commits since v4.1.0.0, HEAD `7ee80c87364`, semantic lane weight 0 |
| Dispatch | Done | Exit 0, 15,130-byte report: 6 CONFIRMED, 4 PARTIAL, 0 REFUTED; 1 P1, 10 P2 |
| Conductor checks | Done | O3, O5, O6, S4 and the P1 confirmed against the cited lines |

### Deviations and findings

| Item | Note |
|------|------|
| cli-claude-code self-invocation guard | The operator named claude2, a second account; the dispatch runs read-only with the child preamble, as in phase 017 |
<!-- /ANCHOR:log -->
