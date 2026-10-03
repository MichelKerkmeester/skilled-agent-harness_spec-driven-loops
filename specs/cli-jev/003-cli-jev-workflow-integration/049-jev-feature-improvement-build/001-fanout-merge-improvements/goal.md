---
title: "Goal: Build: improve the Jev fan-out merge (030)"
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
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/001-fanout-merge-improvements"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5-049"
    recent_action: "All completion criteria met with evidence"
    next_safe_action: "None. The phase is Complete"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-5-5-049"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Build: improve the Jev fan-out merge (030)

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Build the recommendations 048 ranked for the Jev fan-out merge (030) that need no new labels, corpus or default-on switch, and record one re-measure.

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

- [x] `score-fanout-pairs.vitest.ts` passes, with cases for the baselines, the early stop and the report fields
- [x] A replay of the recorded 047 run gives the same modal picks in fewer calls
- [x] The re-measure's verdict line and the amendment are in the log
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
| Build | Done | Luna on cli-codex, resumed once after the usage limit; suite 42 passed |
| Cross-family review | Done | DeepSeek on cli-pi: 0 P0, 1 P1 (re-measure), 3 P2 |
| Re-measure (2026-10-03) | Done | Amendment: the protocol now stops after two agreeing orders and prints three cuts. `verdict jev: keep cut=0.5 K=60 M=60 A=53 B=12 W=44 L=3 F=3 C=124`, 45 seconds, run folder `~/.skilled/.labels/runs/049-001-jev-20261003`. At 0.4: A=57 W=48 F=1. Baselines: constant-same 48, lexical 53 of 60 |
| Validate | Done | `validate.sh --strict` RESULT: PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| Lexical baseline ties Jev at 0.5 | Recorded, not acted on: the word-overlap rule scores 53 of 60, as Jev does at the gate cut. A cut change waits for a held-out batch |
| Review P2s | Three recorded per 003 D5: unasserted baseline counts, replay cannot exercise the tiebreak, two stale feature-catalog lines |
<!-- /ANCHOR:log -->
