---
title: "Goal: Doc Alignment Check"
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
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/016-doc-alignment-check"
    last_updated_at: "2026-11-19T05:52:33Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0b81ad2f-04a7-4ad7-b174-0b3f9930b833"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Doc Alignment Check

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** One `/local-doc-alignment` report on the live docs that describe the merged advisor change is kept in this phase, with every finding triaged and no doc fixed.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | New topic `advisor-pasted-reply` in `topics.json`: narrow terms, the 13 changed source files as code roots, the parent criterion 2 vitest suite as its check |
| D2 | Report only: no `--fix`. Fixing a finding is a separate operator decision |
| D3 | The operator picks the lane preset at the lane checkpoint |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node .skilled/commands/assets/local-doc-alignment/doc-alignment.cjs scope --topic advisor-pasted-reply --out <dir>` prints `STATUS=OK`
- [x] `ls evidence` in this phase prints `findings.json`, `fix-plan.md`, `report.md` and `scope-summary.json`
- [x] Every finding id in `evidence/findings.json` appears in the triage table of `implementation-summary.md`
- [x] `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Topic added and scoped | Done | `doc-alignment.cjs scope` printed `docs=15 lanes=4 checks=1` |

### Deviations and findings

| Item | Note |
|------|------|
| Term breadth | Bare `pasted` and `receipt` match 45 and 75 tracked docs about other features, so the topic uses phrases. A doc that describes the change without any term stays out of scope; the critic is the backstop |
<!-- /ANCHOR:log -->
