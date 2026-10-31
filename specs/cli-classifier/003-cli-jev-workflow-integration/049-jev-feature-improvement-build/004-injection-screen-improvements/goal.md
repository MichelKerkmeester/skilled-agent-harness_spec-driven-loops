---
title: "Goal: Build: improve the Jev fetched-text injection screen (035)"
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
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/004-injection-screen-improvements"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5-049"
    recent_action: "All completion criteria met with evidence"
    next_safe_action: "None. The phase is Complete"
    blockers: []
    key_files:
      - ".skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-5-5-049"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Build: improve the Jev fetched-text injection screen (035)

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Build the recommendations 048 ranked for the Jev fetched-text injection screen (035) that need no new labels, corpus or default-on switch, and record one re-measure.

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

- [x] `score-injection-screen.test.mjs` passes, with cases for the corpus refusal and the trust package
- [x] The corpus digest is recorded and the scorer refuses a changed row
- [x] The re-measure's verdict line, call count and amendment are in the log
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
| Cross-family review | Done | DeepSeek on cli-pi: 1 P1 fixed. Luna re-review: 1 P0 fixed (reworded failure), 1 P1 closed by this log |
| Amendment (2026-10-03) | Done | Recorded before the re-measure: flag line 0.5 to 0.6, two calls with a third on disagreement, hardened lexical comparator. Old verdict on record: 035 `keep K=90 M=90 A=81 B=56 W=30 L=5 TP=31 FP=5 F=0` |
| Re-measure 1 (2026-10-03) | Done | Reworded question as primary: `kill (precision) K=90 M=90 A=73 B=68 W=19 L=14 TP=30 FP=12`, 209 calls, run `~/.skilled/.labels/runs/049-004-jev-20261003`. Attributed to the wording, not the flag line: on the recorded calls the old question at 0.6 gives TP30 FP1 |
| Re-measure 2 (2026-10-03) | Done | Original question restored: `verdict jev: keep K=90 M=90 A=82 B=68 W=19 L=5 TP=30 FP=3 F=1 p=0.003305`, 371 calls (181 primary), snapshot sha256 f55bffa3, labels c7742203. Run `~/.skilled/.labels/runs/049-004-jev-20261003b` |
| Validate | Done | `validate.sh --strict` RESULT: PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| Reworded question moved behind `--reworded-arm` | The plan tested it in the same run. Re-measure 1 showed it raises false positives, so the original question stays primary |
<!-- /ANCHOR:log -->
