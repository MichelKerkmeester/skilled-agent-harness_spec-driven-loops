---
title: "Goal: Phase 8: context-type-hardening"
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
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/008-context-type-hardening"
    last_updated_at: "2026-10-04T12:00:33Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "All six criteria met; no defect measured"
    next_safe_action: "None"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e4486fa5-248b-49a4-8970-229354aab7a1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 8: context-type-hardening

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Measure whether the shared contextType and importance_tier list and its two warnings hold up going forward. Done when: measurement-protocol.md names every set, size, seed and threshold, and its timestamp precedes every result file; the off-list rate of every generator that seeds contextType or importance_tier is recorded; DeepSeek V4.1 Flash, Luna 6 and SWE 2 each write the protocol's number of spec docs cold, and each model's off-list rate has a Wilson 95% interval; both warnings run over the planted matrix, and recall and precision are recorded for each; both warnings run over every existing spec doc and skill doc, and each warning printed is listed with its cause; each measured defect has a source fix and a regression test, and no packet changes its validation result.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Both warnings stay warn-only. |
| D2 | No set, size, seed or threshold changes once the first result file exists. |
| D3 | Model-written docs stay in scratch/ and never enter the corpus. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] measurement-protocol.md names every set, size, seed and threshold, and its timestamp precedes every result file
- [x] the off-list rate of every generator that seeds contextType or importance_tier is recorded
- [x] DeepSeek V4.1 Flash, Luna 6 and SWE 2 each write the protocol's number of spec docs cold, and each model's off-list rate has a Wilson 95% interval
- [x] both warnings run over the planted matrix, and recall and precision are recorded for each
- [x] both warnings run over every existing spec doc and skill doc, and each warning printed is listed with its cause
- [x] each measured defect has a source fix and a regression test, and no packet changes its validation result
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
| Phase opened | Pending | spec, plan, tasks and acceptance criteria written |
| phase 008 measurement | Complete | matrix 180/180 both warnings, corpus 0 of 22,754, generators 0/90, model writers contextType 8/30 (14.2-44.4%), no defect so no fix |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
