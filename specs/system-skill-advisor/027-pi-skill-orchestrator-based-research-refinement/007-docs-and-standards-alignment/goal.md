---
title: "Goal: Docs and Standards Alignment for the Advisor Refinements"
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
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/007-docs-and-standards-alignment"
    last_updated_at: "2026-09-26T20:04:10Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "None. The phase is complete, so rerun the criteria only if it reopens"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-26-030-goal-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Docs and Standards Alignment for the Advisor Refinements

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every document that describes a surface phases 2 to 5 changed state what the code does now, and bring the code those phases added up to the sk-code checklists.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | No new playbook scenario is written for the stale-daemon retry or the Pi deadline, because both need fault injection that the automated tests already perform. |
| D2 | Catalog debt that predates these changes stays out of scope. |
| D3 | A line-length P2 stays open when the flagged line follows its file's established pattern. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Each changed sentence in the scoped documents names behavior the orchestrator confirmed in the cited code
- [ ] `validate_document.py` passes on each edited catalog leaf and README, and `validate-playbook-package.cjs` passes on each edited playbook package
- [ ] No confirmed sk-code P0 or P1 remains in the phase 2 to 5 code: the Pi budget fix lands with a test, and comment hygiene and the drift guards stay clean
- [ ] Running the prompt gate on the transport-down playbook's prompt shows that the prompt passes the gate
- [ ] The Pi prompt advisor catalog leaf exists, the catalog root index links it and the package validator passes
- [ ] `implementation-summary.md` lists each P2 left open with its reason
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
| Phase status | Done | `spec.md` metadata reads Complete, and `implementation-summary.md` holds the evidence |

### Deviations and findings

| Item | Note |
|------|------|
| Source of criteria | The phase is Level 1 and has no `acceptance-criteria.md`, so the criteria come from the Acceptance Criteria column of its `spec.md` requirements table, as the operator approved |
| Criteria left unticked | This goal was authored after the phase closed. The authoring pass did not rerun the checks, so it ticks none |
<!-- /ANCHOR:log -->
