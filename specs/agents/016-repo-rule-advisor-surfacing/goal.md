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
    last_updated_at: "2026-10-04T22:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Amended D6 and added phases 009 and 010"
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
| D1 | Each phase passes validate.sh --strict before its successor starts. 004, 005 and the isolated 007 and 008 runs may overlap. |
| D2 | Build phases 003 to 008 apply the 002 verdict and nothing beyond it, except the operator's simple-terms clause for communication.md in 006. |
| D3 | No once-per-compaction rule hook is built until a measured miss rate justifies one. |
| D4 | Rule trigger_phrases stay in rule frontmatter, with no sidecar. |
| D5 | The 004 baseline is committed before 006 changes any rule. |
| D6 | Measurement windows never overlap on the live repository. 007 and 008 run in isolated test environments that leave live rule files unchanged. A winner goes live only after the 006 window is measured, and 007 decides before an 008 winner is adopted. |

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
| 009-rule-delivery-debugging | `009-rule-delivery-debugging/goal.md` |
| 010-rule-phrase-find-surface | `010-rule-phrase-find-surface/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `validate.sh --recursive --strict` on this packet prints RESULT: PASSED for this packet and all ten phase folders
- [ ] `001-advisor-surfacing/research/research.md` and `002-rule-concision-and-loading/research/research.md` both exist, and each states one verdict
- [ ] `check-rule-copies.js` runs in the `rule-canary` CI workflow and reports every must-carry `AGENTS.md` anchor ending before byte 16,384, with `AGENTS.md` at or under 32,768 bytes
- [ ] `check-repo-rules.cjs` prints RESULT: PASSED with no failed check, and `wc -c` puts the 13 rule files in `.skilled/repo-rules/` at or below 91,028 bytes, a target 006 ADR-002 waives at the measured 94,609
- [ ] `measure-rule-compliance.py` sits in `sk-create-repo-rule/scripts/` with a passing pytest suite, and `git log` shows its baseline under `004-rule-delivery-instrumentation/baselines/` committed before the first 006 rule commit
- [ ] `007-table-wording-experiment` and `008-gate5-card-pilot` each commit `preregistration.md` before their first scored run and record in `results/` a decision made by that pre-registered rule
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
| D2 amendment | Done | operator chose to fold a simple-terms clause for communication.md into 006; D2 and 006 D1 amended, 006 REQ-007 and AC-006 added |
| Byte criterion amendment | Done | operator waived the 91,028 B target; criterion names 006 ADR-002 |
| CI rule canary | Done | pushed c83421238f; Rule Canary Sync and Repo Rules Corpus passed, last delivery-prefix anchor ends at byte 16345 |
| D6 amendment | Done | Operator ran 007 and 008 now in isolated test environments built from edba53daeb. Windows never overlap on the live repository, a winner goes live only after the 006 window, and 007 decides before an 008 winner is adopted. D2 prose shortened to fit the 4,000-char budget, clause detail stays in 006 D1 |
| Phases 009 and 010 added | Done | Phase-add: map rows, binding rows and child goals for 009-rule-delivery-debugging and 010-rule-phrase-find-surface. Criterion 1 now names ten phase folders and criterion 6 says first scored run instead of block 1 |
| 007 and 008 status | In Progress | 007 preregistration committed in edba53daeb and the 600-run experiment is running. 008 arm C dropped under REQ-005 (26,778 B + 7,677 B = 34,455 B), generator and check 11 committed, preregistration pending |
| D1 amendment | Done | operator asked to run 007 and 008 now; D1 lets both run together in isolated environments, live adoption order unchanged under D6 |

### Deviations and findings

| Item | Note |
|------|------|
| Level 1 phases 001, 002, 005 and 007 have no acceptance-criteria.md | Their goals take criteria from spec.md requirements and success criteria plus tasks.md, as the retrofit brief directed |
<!-- /ANCHOR:log -->
