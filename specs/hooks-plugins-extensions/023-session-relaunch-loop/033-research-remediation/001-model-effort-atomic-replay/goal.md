---
title: "Goal: Model and effort replay as one set"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "model effort atomic replay goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/033-research-remediation/001-model-effort-atomic-replay"
    last_updated_at: "2026-10-25T13:42:26Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-model-effort-atomic-replay"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Model and effort replay as one set

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A relaunched session starts on an effort taken from the same entry as its model, so a record that carries a new model without an effort never keeps the effort chosen for the old model, in the wrapper or at arm time.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The fixed defect is a new model without an effort keeping the old effort, in the wrapper and in `armLocked`. The Sonnet low to Opus medium case already relaunches correctly and is a regression guard |
| D2 | The wrapper compares models only when `SKILLED_LOOP_MODEL` was non-empty before the live override; when the accepted live model differs from it and no valid live effort comes with it, the effort flag is dropped so the runtime default applies |
| D3 | An empty launch model proves no switch, and a live model equal to the launch model is no switch; in both cases the launch effort stands |
| D4 | Hermes is exempt from D2 and keeps its launch `--reasoning`, because it records a live model but never an effort |
| D5 | The rule lives in one wrapper function so phase 003 can reuse it |
| D6 | An arm that records a new model without an effort removes the effort the record held |
| D7 | Only model and effort change. The Pi and Hermes provider logic in `skilled-loop` stays as it is |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `validate.sh specs/hooks/023-session-relaunch-loop/033-research-remediation/001-model-effort-atomic-replay --strict` prints `RESULT: PASSED`, with every row in its `acceptance-criteria.md` Met
- [ ] A wrapper table test launches Claude, Codex and Pi with a model and effort `low`, consumes a record with a different model and no effort, and sees no effort flag on each runtime; it fails on the code before the change and passes after
- [ ] A relaunch-core test shows an arm carrying a new model and no effort leaves the record with no `effort` field; it fails on the code before the change and passes after
- [ ] Wrapper guard tests pass before and after the change: a different live model with effort `medium` renders `--effort medium`, `-c model_reasoning_effort="medium"` and `--thinking medium`, and a live model equal to the launch model with no effort keeps the launch effort
- [ ] Wrapper guard tests pass before and after the change: a launch with no `--model` flag keeps its launch effort when the record has a live model and no effort, and a Hermes hop with a different live model and no effort keeps the launch `--reasoning`
- [ ] A live Claude hop launched `--model claude-sonnet-5-5 --effort low` and switched to Opus at medium shows receiver arguments with an Opus model and `--effort medium`, a control hop whose record had its `effort` field removed relaunches with no `--effort`, and live Codex and Pi hops are recorded beside it
- [ ] The implementation summary says whether Claude Code writes a `/model` or `/effort` switch to its session log before the next assistant turn, quoting the transcript lines read
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
| Phase scaffolded with its brief | Done | `../scratch/briefs/001-model-effort-atomic-replay.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Goal written before the spec docs | Reconciled with spec.md and acceptance-criteria.md after review: the headline case became a regression guard, and the empty-launch-model and Hermes guards were added |
<!-- /ANCHOR:log -->
