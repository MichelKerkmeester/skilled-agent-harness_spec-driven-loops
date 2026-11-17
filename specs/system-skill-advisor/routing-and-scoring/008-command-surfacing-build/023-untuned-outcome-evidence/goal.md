---
title: "Goal: Phase 23: untuned-outcome-evidence"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "untuned outcome evidence goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/023-untuned-outcome-evidence"
    last_updated_at: "2026-11-14T08:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the durable directive"
    next_safe_action: "Run T001 once phases 020, 021 and 022 are Complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-023-untuned-outcome-evidence"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 23: untuned-outcome-evidence

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** State from committed scripts what the packet can and cannot show about models using the right workflow on requests nobody tuned for, so the operator sets the target on honest numbers.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every number comes from a committed script's output. No sealed row's text is read, printed or published. |
| D2 | The fit rows are written once by an author who sees no phrase table and scores no draft. After the first capture none is edited, replaced or removed. |
| D3 | A count this phase prints is recorded as found. Nothing is tuned here, and a fit count above zero goes to the operator. |
| D4 | Every earlier metric and summary field keeps its value. New facts arrive as new fields. |
| D5 | No model session and no behaviour run. The arm that would show cause waits on the operator, and so does the target. |
| D6 | No line is called proof of the outcome. Each rate is printed with its range and its limits. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `env -u AI_SESSION_CHILD npx vitest run` in `.skilled/skills/system-skill-advisor/runtime` reports 0 failed.
- [x] `jq -c '.attachedMetrics | [.plain_stages.holdout.total, .fit.skillOnly.total, .fit.decline.total]'` over `command-routing-baseline.json` prints `[44,24,24]`.
- [x] `cmp scratch/earlier-before.json scratch/earlier-after.json` prints nothing and exits 0.
- [x] `git diff --numstat` of `command-prompts.jsonl` against the phase base prints `48` added and `0` removed.
- [x] `scratch/outcome-evidence.txt` holds 11 lines that start with `followed`, 5 that start with `paired` and 5 that start with `limit:`.
- [x] The parent goal log holds the rows `Sealed reach`, `Sealed fit`, `Followed range`, `Paired arms` and `Outcome target`.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/023-untuned-outcome-evidence --strict` prints `RESULT: PASSED` with the phase status Complete.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase planned | Done | 2026-11-14, commit 16c9757ac0 with phase 019's scorer uncommitted. Probe record in `scratch/planning/untuned-reach.before.txt` |
| Sealed reach at planning | Recorded | Real embedding: 5 of 44 sealed plain rows against 33 of 45 tuned. Fixture: 1 of 44 against 28 of 45. Create, deep and design families: 0 of 19 sealed |
| Silence rows at planning | Recorded | 0 of 35, on rows visible during tuning. No sealed row has the label "no command" |
| Level | Decided | `recommend-level.sh --loc 420 --files 7` printed Level 1. Level 2 chosen because the closure gate is `acceptance-criteria.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Review findings in scope | B-1 in its scorer-level parts, and the measurement half of B-11 |
| Waiting on the operator | A behaviour arm on untuned rows with repeats, the target, and the packet that raises the sealed reach |
| Planning correction | The attached count on sealed rows was thought unmeasured. The capture already prints it, so no task adds it |
<!-- /ANCHOR:log -->
