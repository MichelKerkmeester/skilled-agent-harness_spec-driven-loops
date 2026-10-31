---
title: "Goal: Repo rule concision and loading"
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
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading"
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
# Goal: Repo rule concision and loading

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Produce a research verdict on how to write the 13 repo rules shorter while keeping what makes them bind, why loaded rules are ignored and how AGENTS.md, Gate 5 or a hook should load them without loading the same rule twice between compactions.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase produces findings only. No rule, AGENTS.md or REPO RULES.md changes, and a later build packet applies the verdict. |
| D2 | Lineages receive aggregates only, never raw session transcripts. |
| D3 | Four lineages write only under research/: SWE 2 runs three iterations, DeepSeek four, the Luna advocate two and a second Luna lineage three in place of the broken GLM route. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Iteration files on disk number three for SWE 2, four for DeepSeek, two for the Luna advocate and three for the second Luna lineage
- [ ] Every load-bearing claim in research/research.md cites a resolvable file:line or a measurement from prep/
- [ ] research/research.md states, per rule, the enforcement each compression proposal keeps and the enforcement it drops
- [ ] Every hook research/research.md proposes delivers a rule at most once per compaction window, with its mechanism and reset event named
- [ ] research/research.md names each disagreement between lineages with each side's evidence
- [ ] research/research.md gives one recommended loading design, a concision playbook a build packet can apply rule by rule and the full-load token cost before and after compression
- [ ] validate.sh --strict on this phase prints RESULT: PASSED
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
| Phase work | Complete per spec.md | spec.md metadata Status Complete and tasks.md T001 to T013 ticked. Criteria left unticked until an evaluator confirms them |

### Deviations and findings

| Item | Note |
|------|------|
| No acceptance-criteria.md | Level 1 phase. Criteria come from spec.md REQ-001 to REQ-005, SC-001 and SC-002 and tasks.md T013 |
<!-- /ANCHOR:log -->
