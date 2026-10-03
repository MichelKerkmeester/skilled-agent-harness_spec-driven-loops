---
title: "Goal: Jev feature improvement build"
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
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build"
    last_updated_at: "2026-10-03T00:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "All 12 children Complete with evidence"
    next_safe_action: "None. The phase is Complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-5-5-049"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Jev feature improvement build

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Build the recommendations 048 ranked for each researched Jev feature that need no new labels, corpus or default-on switch, and fix the deep-research workflow faults 048 hit.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each child builds only what its spec names. New corpora, new labels and any default-on switch stay out, per 003 D4 and 047 D6 |
| D2 | A changed flag line, call protocol, aggregation or question text is a keep-rule amendment, logged before the re-measure, with the old verdict kept on record |
| D3 | Workers per 003 D5. The session verifies and commits, path-scoped |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-fanout-merge-improvements | `001-fanout-merge-improvements/goal.md` |
| 002-track-narrowing-improvements | `002-track-narrowing-improvements/goal.md` |
| 003-citation-drift-improvements | `003-citation-drift-improvements/goal.md` |
| 004-injection-screen-improvements | `004-injection-screen-improvements/goal.md` |
| 005-hallucination-grader-improvements | `005-hallucination-grader-improvements/goal.md` |
| 006-verdict-fallback-improvements | `006-verdict-fallback-improvements/goal.md` |
| 007-clarify-default-improvements | `007-clarify-default-improvements/goal.md` |
| 008-folder-suggestion-improvements | `008-folder-suggestion-improvements/goal.md` |
| 009-pi-transport-improvements | `009-pi-transport-improvements/goal.md` |
| 010-completion-claims-improvements | `010-completion-claims-improvements/goal.md` |
| 011-research-run-init-via-gateway | `011-research-run-init-via-gateway/goal.md` |
| 012-fanout-runner-and-prompt-fixes | `012-fanout-runner-and-prompt-fixes/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] All 12 child goals pass every completion criterion, each with its evidence in the child's log
- [x] Each changed suite passes at or above its baseline captured before the change
- [x] `validate.sh --strict --recursive` prints `RESULT: PASSED` on this phase and its 12 children
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
| Phase opened | Done | 12 children scaffolded and filled 2026-10-03: ten from 048's ranked tables, two from 048's goal log |
| Children (2026-10-03) | Done | All 12 Complete, each child goal 0 open criteria: 001 `61cd7df45f`, 002 `5d98ef694a`, 003 `ea904ee928`, 004 `ad1725c6c1`, 005 `e3f6dedf1a`, 006 `890bc2a569`, 007 `6d9e5bdda5`, 008 `d4a1a85dd8`, 009 `87cd7c8dc4`, 010 `b2f94dfe29`, 011 `6c993dd1e2`, 012 `eb3580b152` and `004aa45d69` |
| Re-measures (2026-10-03) | Done | Every live re-measure keeps or adopts; 007 stops at its label gate with 12 of 54 rows still clarifying; 009's paired run on the official host adopts (agreement 95.1, p95 299/575 ms) |
| Suites on the final tree (2026-10-03) | Done | Deep-loop runtime 161 of 161 files, 2,901 passed (2,893 passed and 2 failed before the regression fixes); cli-classifier 128 of 128 (125 before). The three regressions the build caused were fixed in `18a770b143`, `cde1e624cf` and `adea1ddfa7`. deep-improvement keeps 8 files failing on a missing `@spec-kit/shared` module that predates 049. Two load-sensitive runner tests fail at HEAD under a load average near 20 and passed in this run |
| Validate | Done | `validate.sh --strict --recursive` on this phase: 13 of 13 RESULT: PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| Amended child scopes | 005 widened to its caller and docs, 007 gained a replay fixture, 009 paired on the official host because the OpenRouter pairing needed a key 003 D1 forbids, 012 carried the refusal on disk and moved the absolute path into the runner. Each amendment sits in its child's log |
<!-- /ANCHOR:log -->
