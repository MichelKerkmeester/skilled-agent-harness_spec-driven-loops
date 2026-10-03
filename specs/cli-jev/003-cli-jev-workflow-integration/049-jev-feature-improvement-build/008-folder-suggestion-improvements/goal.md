---
title: "Goal: Build: improve the Jev spec-folder suggestion (022)"
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
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/008-folder-suggestion-improvements"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5-049"
    recent_action: "All completion criteria met with evidence"
    next_safe_action: "None. The phase is Complete"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-5-5-049"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Build: improve the Jev spec-folder suggestion (022)

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Build the recommendations 048 ranked for the Jev spec-folder suggestion (022) that need no new labels, corpus or default-on switch, and record one re-measure.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
| ---- | ---------- |
| D1 | Build only what this spec names. New corpora, new labels and any default-on switch stay out, per 003 D4 and 047 D6 |
| D2 | A change to a flag line, call protocol, aggregation or question text is a keep-rule amendment. Record it in the log before the re-measure, and keep the old verdict on record |
| D3 | A re-measure calls live Jev only when `jev auth status` passes, and records every call with `--out` |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `score-alignment-suggestion.vitest.ts` passes, with cases for the basename collision, recall and the comparator flag
- [x] The f022-001 options all carry descriptions in a dry run
- [x] The re-measure's verdict line and the f022-001 pick are in the log
- [x] `validate.sh --strict` prints `RESULT: PASSED` on this phase
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
| Phase opened | Done | Spec, plan, tasks and goal authored 2026-10-03 from 048's ranked table |
| Build | Done | Luna on cli-codex |
| Session dry run | Done | The path branch never fired on real rows; DeepSeek fixed it, so every f022-001 option carries a description |
| Cross-family review | Done | Luna: 1 P0 fixed (census rows), 1 P1 fixed (gated arm scoring asserted), 1 P1 closed by this log |
| Amendment (2026-10-03) | Done | Recorded before the re-measure: path-resolved descriptions, gated arm reported beside the three-pass arm, negative controls. Old verdict on record: 022 `keep K=40 M=40 A=39 B=30 W=10 L=1 F=0 p=0.0059 baseline=top`, 121 calls |
| Re-measure (2026-10-03) | Done | `verdict jev: keep K=40 M=40 A=39 B=30 W=10 L=1 F=0 p=0.0059 baseline=top`, same as 022. f022-001 picks `007-classifier-deep-research` (label `001-deep-research`). Label swap W+L=10, interval [0.722, 1.000]. Distractor state: kill W=0 L=30. Candidate recall 40 of 40. Pins: report e207895e, scorer 62c36db0, corpus 815d3ac8. Run `~/.skilled/.labels/runs/049-008-jev-20261003b` |
| Validate | Done | `validate.sh --strict` RESULT: PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| Foreign-label refusal replaced by candidate recall | The scorer used to exit 2 on a label outside a row's options. R3 counts such a row as a recall miss, which adds no win or loss to the sign test |
<!-- /ANCHOR:log -->
