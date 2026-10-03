---
title: "Goal: Pi default transport and feature review"
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
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/050-pi-default-review"
    last_updated_at: "2026-10-03T00:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Build phase 001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-5-5-050"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Jev feature improvement build

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Pi default transport and feature review

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Answer Jev calls through Pi by default when Pi can answer them, then leave the nine features under review tested, re-measured and fixed over that default.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | No feature turns on by default, per 047 D6. Only the transport's route changes |
| D2 | The nine features are 032, 037, 035, 025, 024, 017, 026, 029 and 031 |
| D3 | Phase 002's reviewer is a fresh Claude Opus 5.5 at xhigh. Workers are DeepSeek V4.1 Flash max on cli-pi and Luna 6 max fast on cli-codex. The session verifies and commits, path-scoped |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-pi-default-transport | `001-pi-default-transport/goal.md` |
| 002-feature-review-and-remeasure | `002-feature-review-and-remeasure/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Both child goals pass every completion criterion, each with its evidence in the child's log
- [ ] Each changed suite passes at or above its baseline captured before the change
- [ ] `validate.sh --strict --recursive` prints `RESULT: PASSED` on this phase and both children
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
| Phase opened | Done | Source: the operator, 2026-10-03: "Make cli pi default transport if available", then a fresh Opus 5.5 xhigh review, test, re-measure and fix of the features worth wiring in and those stopped on margin, with DeepSeek V4.1 Flash max on cli-pi and Luna 6 max fast on cli-codex as workers |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
