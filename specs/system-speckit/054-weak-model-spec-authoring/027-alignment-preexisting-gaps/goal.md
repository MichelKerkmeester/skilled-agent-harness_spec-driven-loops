---
title: "Goal: Phase 27: alignment-preexisting-gaps"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "alignment preexisting gaps goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/027-alignment-preexisting-gaps"
    last_updated_at: "2026-10-27T21:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Ticked two completion criteria and logged the 2026-10-27 scope amendment"
    next_safe_action: "Finish AC-004, then run the closeout gates"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-027-alignment-preexisting-gaps"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 27: alignment-preexisting-gaps

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Fix the three pre-existing gaps in `scratch/items.md` so the README checkers, the advisor and the alignment aggregator report what is really wrong.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every README false positive is fixed at the checker, never by editing a README. |
| D2 | A1 changes routing vocabulary and metadata only. If it needs a scorer change, the lane stops and reports why. |
| D3 | Lane T files are gitignored, so their evidence is the aggregator rerun output, not a git diff. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `run-script-tests.sh` exits 0 with the new checker tests, and the root README no longer reports slash commands as unresolved
- [x] The advisor ranks sk-doc first on the four packet-local changelog probes and system-spec-kit first on the four spec-kit probes
- [ ] Every row of this phase's `acceptance-criteria.md` reads Met
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
| Spec docs authored | Done | spec, plan, tasks, acceptance criteria and goal filled from `scratch/items.md` |
| Lane R reference checker | Done | `check_readme_references.py` on the seven READMEs: 608 unresolved before, 0 after, 7/7 PASS. `run-script-tests.sh` passes with 35 new cases |
| Lane A advisor routing | Done | Golden, prompt-policy and holdout suites pass (36 tests). Full advisor suite 1267 passed, 0 failed against 1253 |
| Lane T aggregator | Done | DeepSeek copy: 27 findings with P1=8 became 23 with P1=5 and overturned=4. The numeric-id run no longer crashes |
| Lane R count checker | Open | Another agent is finishing it. AC-004 and T004 stay Unmet |
| Closeout gates | Open | Recursive validation, commit, rebase and trigger-index rebuild, AC-008 to AC-011 |

### Deviations and findings

| Item | Note |
|------|------|
| Scope amendment (2026-10-27) | D1 and D2 are amended. The metadata fix alone fixed 2 of 4 probes, and on the operator's "fix not fixed items" and then "fix all" the conductor approved one narrow scorer rule in `primaryIntentBonus` (`fusion.ts`) plus two constants (`scoring-constants.ts`). The operator's "fix all, perfect it" brought in the README lines the stricter checker exposed as real broken references or shorthand. Recorded in spec.md §3 and plan.md §1 |
| Presentation contract | Names the Overturned count and `overturned.json` but not the `overrides` input shape, so CHK-040 stays open |
<!-- /ANCHOR:log -->
