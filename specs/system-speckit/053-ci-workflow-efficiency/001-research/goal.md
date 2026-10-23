---
title: "Goal: Phase 1: CI workflow efficiency research"
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
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/001-research"
    last_updated_at: "2026-10-23T12:05:42Z"
    last_updated_by: "devin"
    recent_action: "Authored the durable directive"
    next_safe_action: "Plan phase 002 trigger surgery from research/research.md section 15"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/deep-research-config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-001-ci-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 1: CI workflow efficiency research

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Produce a measured, cited plan that later phases can implement mechanically: what to change, in what order, for what saving and at what risk.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Executor is cli-pi on `deepseek-v4.1-flash-1017` at max thinking, 20 iterations, stop policy max-iterations and convergence off. |
| D2 | Every load-bearing claim in `research/research.md` cites a file:line or run id and is labelled confirmed, documented or inferred. |
| D3 | Research only. No workflow, script, action or skill changes, and no file outside this phase folder and the parent's own docs changes. |
| D4 | The on/off control is `vars.SKILLED_CI*` in a job-level `if:`, on by default; `/doctor:ci` is a doctor router with a read-only `report` and a confirmed-write `scaffold`; `sk-code-ci` is a read-only sk-code surface, and sk-git owns neither. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `research/research.md` exists and ranks ten recommendations, each with saving, risk and effort
- [x] `research/iterations/` holds 20 files, `iteration-001.md` through `iteration-020.md`
- [x] A citation sweep of `research/research.md` reports zero unresolved `[SOURCE: ...]` paths, and every load-bearing claim carries a confirmed, documented or inferred label
- [x] `research/deep-research-config.json` records executor cli-pi, model `deepseek-v4.1-flash-1017`, 20 iterations and convergence off
- [x] `research/research.md` groups proposed phases 002-008 with scope, workflows, saving, risk, order and dependencies, and covers the on/off control, `/doctor:ci` ownership, `sk-code-ci` registration cost and the duplicate provisioning measurement
- [x] Strict validation of this folder prints `RESULT: PASSED`
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
| Research run | Done | 20 iterations, commit a506589406 |
| Acceptance criteria | Done | 7 of 7 rows Met in acceptance-criteria.md |
| Strict validation | Done | `validate.sh ... --strict --no-recursive` printed `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| Settings raised from 10 to 20 iterations with convergence off before iteration 1 | The not-yet-started state was re-initialized rather than edited, so the ledger's opening record matches the config. |
| Three claims did not reproduce | Corrected in a later iteration or in the synthesis addendum; `research/research.md` section 20 records the re-check. |
<!-- /ANCHOR:log -->
