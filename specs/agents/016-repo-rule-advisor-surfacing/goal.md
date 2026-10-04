---
title: "Goal: Repo rule surfacing, concision and loading"
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
    packet_pointer: "agents/016-repo-rule-advisor-surfacing"
    last_updated_at: "2026-10-04T16:40:25Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "create-goal-retrofit-2026-10-04"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Repo rule surfacing, concision and loading

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Decide from repository evidence what should surface repo rules, how to write them shorter without losing what enforces them and how AGENTS.md, Gate 5 or a hook should load them, then apply that verdict to the rule corpus and its loaders.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each phase passes validate.sh --strict on its own before its successor starts. Only 004 and 005 may start in parallel with the phase before them. |
| D2 | Build phases 003 to 008 apply the 002 verdict and nothing beyond it. |
| D3 | No once-per-compaction rule hook is built until a measured miss rate justifies one. |
| D4 | Rule trigger_phrases stay in rule frontmatter, with no sidecar. |
| D5 | The 004 baseline is committed before 006 changes any rule. |
| D6 | Measurement windows never overlap: 006 ships and its post-change window is measured before 007 starts, and 007 commits its wording decision before 008 starts. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-advisor-surfacing | `001-advisor-surfacing/goal.md` |
| 002-rule-concision-and-loading | `002-rule-concision-and-loading/goal.md` |
| 003-agents-md-delivery-prefix | `003-agents-md-delivery-prefix/goal.md` |
| 004-rule-delivery-instrumentation | `004-rule-delivery-instrumentation/goal.md` |
| 005-trigger-coverage-check | `005-trigger-coverage-check/goal.md` |
| 006-rule-concision-rewrites | `006-rule-concision-rewrites/goal.md` |
| 007-table-wording-experiment | `007-table-wording-experiment/goal.md` |
| 008-gate5-card-pilot | `008-gate5-card-pilot/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `validate.sh --recursive --strict` on this packet prints RESULT: PASSED for this packet and all eight phase folders
- [ ] `001-advisor-surfacing/research/research.md` and `002-rule-concision-and-loading/research/research.md` both exist, and each states one verdict
- [ ] `check-rule-copies.js` runs in the `rule-canary` CI workflow and reports every must-carry `AGENTS.md` anchor ending before byte 16,384, with `AGENTS.md` at or under 32,768 bytes
- [ ] `check-repo-rules.cjs` prints RESULT: PASSED with no failed check, and `wc -c` puts the 13 rule files in `.skilled/repo-rules/` at or below 91,028 bytes
- [ ] `measure-rule-compliance.py` sits in `sk-create-repo-rule/scripts/` with a passing pytest suite, and `git log` shows its baseline under `004-rule-delivery-instrumentation/baselines/` committed before the first 006 rule commit
- [ ] `007-table-wording-experiment` and `008-gate5-card-pilot` each commit `preregistration.md` before block 1 and record in `results/` a decision made by that pre-registered rule
- [ ] After the 008 decision, `git status` and a file listing show no artifact of a rejected card arm
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
| Goal retrofit | Done | Parent and eight phase goals authored on 2026-10-04 from each folder's own spec.md, acceptance-criteria.md where present and tasks.md |
| Phases 001 and 002 | Complete per the phase map | spec.md Phase Documentation Map. Criteria left unticked until an evaluator confirms them |

### Deviations and findings

| Item | Note |
|------|------|
| Level 1 phases 001, 002, 005 and 007 have no acceptance-criteria.md | Their goals take criteria from spec.md requirements and success criteria plus tasks.md, as the retrofit brief directed |
<!-- /ANCHOR:log -->
