---
title: "Goal: Rule delivery instrumentation"
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
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/004-rule-delivery-instrumentation"
    last_updated_at: "2026-10-04T16:40:25Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "create-goal-retrofit-2026-10-04"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Rule delivery instrumentation

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** One command reports, per runtime and with denominators and intervals, how often a session needed a repo rule and did not have it, and how each prohibition fared under each rule version.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase builds an offline analyzer and its tests. No hook is built and no rule or instruction file changes. |
| D2 | Output carries counts and rates only, never transcript, prompt or file text. |
| D3 | The analyzer lives at .skilled/skills/sk-doc/sk-create-repo-rule/scripts/measure-rule-compliance.py, promoted from the 002 prep/ copy. |
| D4 | Task categories stop at write versus read-only sessions. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] A pytest privacy test runs the analyzer on fixtures carrying distinctive marker strings, and no marker appears in its output
- [ ] pytest shows a fixture with one write before and one after a REPO RULES.md read reporting one Gate 5 miss and one hit with denominator 2
- [ ] pytest shows a fixture with a Read, a cat and an injection of the same rule across two compaction windows counting each channel and each window
- [ ] pytest with a temporary git repo shows replies on each side of two rule versions assigned to the correct version
- [ ] pytest shows a Codex session fixture producing a Codex row
- [ ] On the evidence pack's window and arguments, the analyzer's Read-channel counts match 002-rule-concision-and-loading/prep/evidence-pack.md §3
- [ ] git log shows the baseline report under baselines/ committed before phase 006 starts
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
| Phase work | Pending | spec.md metadata Status Draft. Criteria trace to acceptance-criteria.md AC-001 to AC-007 |
| Analyzer and tests | Done | 9/9 pytest; evidence-pack reproduction exact with --until 2026-10-04T13:13:10Z --channels read,shell,other |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
