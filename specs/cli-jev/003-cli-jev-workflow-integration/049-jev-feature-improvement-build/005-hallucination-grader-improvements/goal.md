---
title: "Goal: Build: improve the Jev hallucination grader (024)"
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
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/005-hallucination-grader-improvements"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5-049"
    recent_action: "All completion criteria met with evidence"
    next_safe_action: "None. The phase is Complete"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-5-5-049"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Build: improve the Jev hallucination grader (024)

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Build the recommendations 048 ranked for the Jev hallucination grader (024) that need no new labels, corpus or default-on switch, and record one re-measure.

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

- [x] `d4-agreement.vitest.ts` passes, with cases for the unmeasured state, forwarded context and escalation
- [x] All 21 benchmark fixtures carry an `allowlist`
- [x] The repeat run's verdict line and the amendment are in the log
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
| Cross-family review | Done | DeepSeek on cli-pi: 1 P1 and 2 P2 fixed. Luna re-review: 1 P1 fixed (caller-forwarding test), 1 P1 closed by this log, 1 P2 misattributed (`reviewer-schema.md` is phase 006's) |
| Amendment (2026-10-03) | Done | Recorded before the repeat run: fixtures fed with allowlists, context forwarded, cascade arm added. Old verdict on record: 047 `keep K=56 M=56 A=55 B=47 W=8 L=0 F=1 p_win=0.003906`, 169 calls |
| Repeat run (2026-10-03) | Done | `verdict jev: keep K=56 M=56 A=55 B=47 W=9 L=1 F=1 p_win=0.01074`, class yes 9 of 9, no 46 of 47. `verdict cascade: keep W=8 L=0 p_win=0.003906`, routed 30 of 56, 90 model calls. 260 calls in all. Run `~/.skilled/.labels/runs/049-005-jev-20261003` |
| Validate | Done | `validate.sh --strict` RESULT: PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| Caller and docs added to scope (2026-10-03) | Review P1: `run-benchmark.cjs:457-461` built `criteria` without task, spec or allowlist, so R3's forwarding never reached a real run. Review P2: the playbook still expected `allowlist: 0 of 21` and the catalog lacked the cascade arm. The session added the caller, the playbook census scenario and index, and the catalog entry to Files to Change |
| Scope widened to the caller and docs | Recorded in an earlier spec amendment: forwarding needed `run-benchmark.cjs`, and the census change moved a playbook scenario and the catalog entry |
<!-- /ANCHOR:log -->
