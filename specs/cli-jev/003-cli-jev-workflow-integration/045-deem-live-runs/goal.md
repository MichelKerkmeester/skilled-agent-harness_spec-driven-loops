---
title: "Goal: Phase 45: deem-live-runs"
description: "Run every scorer's Deem arm once against the local Deem server and record each result, and close the three Deem findings phase 044 recorded."
trigger_phrases:
  - "deem live runs"
  - "deem arm results"
  - "local deem measurement"
  - "cli-deem open findings"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/045-deem-live-runs"
    last_updated_at: "2026-10-02T11:00:00Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Closed the phase as superseded by the Deem removal"
    next_safe_action: "Work phase 046"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-045-deem-live-runs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 45: deem-live-runs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Measure every scorer's Deem arm on the local Deem server now that the client reads real answers, and close the open Deem findings.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The operator's "Do all deem things needed / open" (2026-10-02) is the yes for live `--deem` runs. Deem runs on the local server only, so nothing leaves the machine. No `--jev` run is part of this phase |
| D2 | Each scorer runs once, sequentially, with its recorded label file and `--out` under `~/.skilled/.labels/runs/045-deem-20261002/`. A gate stop or a missing input is a result to record, not a failure to work around |
| D3 | The three Deem findings phase 044 recorded are fixed: the wire contract's HTTP 400 claim, the `temperature` fixture field and the client's score-level and choice-option counts |
| D4 | SWE 2 max on cli-devin writes the fixes. The session runs the scorers, verifies and commits. One DeepSeek V4.1 Flash review: fix P0 and P1, record P2. Path-scoped commits, main only on the operator's go, no key in a file, no `.env` opened |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Every scorer with a `--deem` switch, 20 in all, has a `<id>.stdout.txt`, `<id>.stderr.txt` and exit status under `~/.skilled/.labels/runs/045-deem-20261002/`, and `goal.md`'s log records each one's result line
- [ ] No Deem run reports a `cli-deem` answer-shape error, such as `unexpected response`, in its call log or stderr
- [x] `node --test .skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs` passes more than 39 tests with 0 failing, with cases for 1 and 11 score levels and 1 choice option exiting 2
- [ ] The DeepSeek V4.1 Flash review of these changes leaves no open P0 or P1
- [x] `validate.sh --strict` prints `RESULT: PASSED` and `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)` on this phase and on `specs/cli-jev/003-cli-jev-workflow-integration`
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
| Inventory | Done | 19 JS and TS scorers take `--deem`, plus 034's Python lens. 042's `gates.md` records each label file. Gates open for 006, 023, 029, 030, 031, 032 and 035 |
| P2 fixes | Done | SWE 2 max, brief `045a.md`, 636 s. The client exits 2 before any request on a score outside 2 to 10 levels (`score needs 2 to 10 -l levels`) and a choice with 1 option (`choice needs at least 2 -o options`). Every fake choice answer uses `x_temperature`. The wire contract and README say the server reads `criteria` first with `options` and `levels` as aliases, and SWE set the caps table to HTTP 422 after reading `deem_server.py`. The session widened two remaining "HTTP 400 exits 1" lines to "an HTTP 4xx such as 422", since any status under 500 but not 200 exits 1. cli-deem 44 pass (39 before), every changed doc validates, Hermes PASS 72 |
| Runs | Stopped | Two of 20 finished before the operator's "Stop and deprecate deem completely". 002 jev-tiebreak `kill`: Deem won 7 tiebreaks and lost 29, 111 of 111 rows measured, 528 calls. 006 goal-lint `kill` on rule 4 (tp 64, fp 18, fn 14, tn 2) and rule 5 (tp 29, fp 8, fn 46, tn 15). 017 stalled on its file searches and was stopped. Output in `~/.skilled/.labels/runs/045-deem-20261002/` |
| Closure | Done | Criteria 1, 2 and 4 are superseded by ADR-001 in `decision-record.md`, since phase 046 removes every Deem arm. Criteria 3 and 5 are met |

### Deviations and findings

| Item | Note |
|------|------|
| The HTTP 400 premise | The wire contract says Deem answers `criteria` with HTTP 400. On 2026-10-02 the local server answered a `choice` with a `criteria` map and a `score` with a `criteria` list with HTTP 200, in Jev's own field names |
<!-- /ANCHOR:log -->
