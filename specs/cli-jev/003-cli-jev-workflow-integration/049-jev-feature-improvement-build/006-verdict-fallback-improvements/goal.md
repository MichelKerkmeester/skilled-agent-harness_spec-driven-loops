---
title: "Goal: Build: improve the Jev reviewer verdict fallback (025)"
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
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/006-verdict-fallback-improvements"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5-049"
    recent_action: "All completion criteria met with evidence"
    next_safe_action: "None. The phase is Complete"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-5-5-049"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Build: improve the Jev reviewer verdict fallback (025)

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Build the recommendations 048 ranked for the Jev reviewer verdict fallback (025) that need no new labels, corpus or default-on switch.

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

- [x] `verdict-fallback.vitest.ts` passes, with cases for each of the five verdict forms and the abstain outcome
- [x] `reviewer-schema.md` names the typed verdict field and the parser reads it first
- [x] `reviewer-regression.json` lists `jev` as an opt-in grader with miss-case fixtures
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
| Cross-family review | Done | DeepSeek on cli-pi: 1 P1 fixed (miss fixtures in the default run). Luna re-review: no P0 or P1 |
| Re-measure (2026-10-03) | Done | Amendment recorded first: one call per miss instead of three orders, abstain outcome, wider parser. Old verdict on record: 025 `keep K=24 M=24 A=24 B=8 W=16 L=0 F=0 p_win=0.00001526`, 73 calls. New: same line, 25 calls (24 rows plus 1 auth). Run folder `~/.skilled/.labels/runs/049-006-jev-20261003`, labels sha256 876874b0 |
| Validate | Done | `validate.sh --strict` RESULT: PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| Miss fixtures scoped to the jev grader | Not in the plan. The review found they changed the default noop aggregate, so they load only when jev is chosen |
<!-- /ANCHOR:log -->
