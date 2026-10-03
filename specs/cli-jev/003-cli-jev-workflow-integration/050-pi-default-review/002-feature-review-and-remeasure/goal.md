---
title: "Goal: Phase 2: Review, test, re-measure and fix nine Jev features"
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
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/050-pi-default-review/002-feature-review-and-remeasure"
    last_updated_at: "2026-10-03T17:39:28Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
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
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 2: Review, test, re-measure and fix nine Jev features

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Leave each of the nine reviewed features with a passing suite and a fresh verdict over the default transport.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
| ---- | ---------- |
| D1 | The reviewer is a fresh Claude Opus 5.5 at xhigh, named by the operator. Its workers are DeepSeek V4.1 Flash max on cli-pi and Luna 6 max fast on cli-codex |
| D2 | A re-measure calls live Jev only when `jev auth status` passes, records every call with `--out` and names the route counts |
| D3 | A change to a flag line, call protocol, aggregation or question text is an amendment, logged before the re-measure, with the old verdict kept on record |
| D4 | No new labels or corpora, per 003 D4. The session verifies and commits, path-scoped |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Each of the nine features has a log row with its review result, suite pass count and verdict line or recorded reason
- [ ] Each verdict line names its run folder and how many calls Pi and the CLI answered
- [ ] Each changed suite passes at or above its baseline, and no P0 or P1 stays open after the cross-family review
- [ ] `validate.sh --strict` prints `RESULT: PASSED` on this phase
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
| Phase opened | Done | Spec, plan, tasks and goal authored 2026-10-03 from the operator's request |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
