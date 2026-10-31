---
title: "Goal: Build: improve the Jev routing clarify default (020)"
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
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/007-clarify-default-improvements"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5-049"
    recent_action: "All completion criteria met with evidence"
    next_safe_action: "None. The phase is Complete"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-5-5-049"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Build: improve the Jev routing clarify default (020)

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Build the recommendations 048 ranked for the Jev routing clarify default (020) that need no new labels, corpus or default-on switch.

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

- [x] `score-clarify-default.test.cjs` passes, with cases for the replay refusal, the digests and the baselines
- [x] A replay of the recorded 047 run gives the same picks in 118 calls or fewer
- [x] The count of eligible rows on the pinned build is recorded in the log
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
| Cross-family review | Done | DeepSeek on cli-pi: 2 P1 fixed after a spec clarification. Luna re-review: 1 P0 and 2 P1 fixed, 1 P2 recorded |
| Recorded-run replay (2026-10-03) | Done | Early stop over `~/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl`: same modal pick on 54 of 54 rows in 118 calls. 047 line on record: `keep K=54 M=54 A=28 B=15 W=17 L=4 F=10 p=0.003599`, 163 calls |
| Eligible rows on the current build (2026-10-03) | Done | 12 of 54 rows still clarify at HEAD; 42 now route. The scorer stops at the label gate |
| Validate | Done | `validate.sh --strict` RESULT: PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| REQ-001 and SC-002 clarified (2026-10-03) | Review P1s. A refused row aborted the whole run, while the spec's purpose, plan and research all say the scorer scores only rows that still clarify. The session, as spec author, ruled the refusal is per row: the row is dropped and reported, and the label gate reads the eligible count. The early stop counted a skipped third vote as agreement, so a replay of the recorded run gave F=9 where the three-call run recorded F=10. SC-002 now asks for the same modal picks with flips over measured votes, not a byte-equal report |
| Replay fixture added to the file list | The recorded run lives outside the repository, so the test needed a committed copy of its picks |
<!-- /ANCHOR:log -->
