---
title: "Goal: Build: improve the Jev spec-track narrowing (017)"
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
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/002-track-narrowing-improvements"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5-049"
    recent_action: "All completion criteria met with evidence"
    next_safe_action: "None. The phase is Complete"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-5-5-049"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Build: improve the Jev spec-track narrowing (017)

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Build the recommendations 048 ranked for the Jev spec-track narrowing (017) that need no new labels, corpus or default-on switch, and record one re-measure.

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

- [x] `score-track-narrowing.vitest.ts` passes, with cases for the `--out` guard, the pins and the new tables
- [x] A replay of the recorded 047 run prints the same verdict line plus the three extra arms
- [x] The repeat run's verdict line and bootstrap interval are in the log
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
| Build | Done | Luna on cli-codex; suite 28 passed |
| Cross-family review | Done | DeepSeek on cli-pi: 0 P0, 2 P1 (replay fixed by Luna, repeat run below), 5 P2 recorded |
| Replay check (2026-10-03) | Done | 017's recording replays at K=256 M=256 A=97 with 0 dropped rows |
| Repeat run (2026-10-03) | Done | Amendment: report pins, probability-aware and one-call arms, per-track table, bootstrap. `verdict jev: stop (margin) K=270 M=270 A=106 B=82 W=80 L=56 F=48 p=0.02409`; probability-aware `stop (margin) A=102`, decided subset 102/203, margin slack -7.0 rows; one-call `stop (margin) A=103 F=0`; bootstrap 95% CI [-0.1185, 0.2760], 16 clusters, 1,000 replicates. Run folder `~/.skilled/.labels/runs/049-002-jev-20261003` |
| Validate | Done | `validate.sh --strict` RESULT: PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| Repeat verdict differs from 017 | 017 recorded keep on 256 rows; the repeat on 270 rows stops on margin. Recorded, not chased: the corpus and the baseline moved, which is what a repeat exists to catch |
<!-- /ANCHOR:log -->
