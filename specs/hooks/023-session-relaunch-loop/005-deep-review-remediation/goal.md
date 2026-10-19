---
title: "Goal: Phase 5: deep-review-remediation"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "deep review remediation goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/005-deep-review-remediation"
    last_updated_at: "2026-10-18T13:25:36Z"
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
# Goal: Phase 5: deep-review-remediation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every advisory from the deep review of the session relaunch loop is fixed and tested, the packet code follows sk-code-opencode, and the docs say what the code does.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every code fix starts with a test that fails on the code before the fix. |
| D2 | The parser keeps accepting the old Skip suffix, so a note or seed written before the fix still carries its Skip. |
| D3 | The parent's frozen decisions D2, D3 and D4 do not change in this phase. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node --test` on the concern's test files ends with `# fail 0`, with a named test for each of the nine code findings
- [x] `rg` finds one definition each of `plannedNotePath`, the threshold resolver and the seed parser, all in the core
- [x] The WS4 docs match `skilled-loop` and their validators exit 0
- [x] `run-all-drift-guards.sh` exits 0 after the sk-code-opencode alignment review's fixes
- [x] `validate.sh specs/hooks/023-session-relaunch-loop --recursive --strict` prints `RESULT: PASSED`
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
| Phase scaffolded and planned | Done | spec, plan, tasks, acceptance criteria |
| Twelve review findings fixed, plus every lane-review and alignment finding | Done | `../scratch/run-ledger.md:421`-`:458`; acceptance-criteria.md 7/7 Met |
| Final gate and recursive strict validation | Done | node 375/375 and all counts at or above baseline; RESULT: PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| Lane reviews kept finding issues | Each fresh SWE review of the killer lock raised new P2 items. All of them were fixed with tests; after three rounds of narrowing edge cases on the same block, the orchestrator accepted the last fix by its own diff review |
| Spec docs authored by the orchestrator | The plan names Luna for spec drafts; Codex quota is out until Oct 22 and the docs restate the review report |
<!-- /ANCHOR:log -->
