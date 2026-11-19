---
title: "Goal: Phase 17: ollama-advisor-analysis"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "ollama advisor analysis goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/017-ollama-advisor-analysis"
    last_updated_at: "2026-11-19T12:45:17Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 17: ollama-advisor-analysis

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Produce one sourced report on the skill advisor's Ollama and embedder path that says what to fix, simplify or drop, and how to cut its load and stop its daemons piling up.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The analysis runs once, read-only, as Fable 5.2 at medium effort on the `claude2` account, which the operator named |
| D2 | Report only: no code, doc or config change outside this phase folder; fixes are a separate operator decision |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `evidence/report.md` exists with sections for bugs, effectiveness, overengineering, load and daemon build-up, and `rg -c 'ts:[0-9]+|cjs:[0-9]+|mjs:[0-9]+'` on it prints at least 5
- [x] `implementation-summary.md` lists each ranked finding as confirmed or not, with the line read
- [x] `git status --short` shows no change outside this phase folder from the dispatch, and `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Baseline | Done | 3 advisor daemon pairs, 0 Ollama processes |

### Deviations and findings

| Item | Note |
|------|------|
| cli-claude-code self-invocation guard | The operator named claude2, a second account; the dispatch runs read-only with the child preamble |
<!-- /ANCHOR:log -->
